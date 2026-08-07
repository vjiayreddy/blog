import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Post } from "@/models/Post";
import { Page } from "@/models/Page";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectDB();
  const now = new Date();

  const duePosts = await Post.find({
    status: "scheduled",
    scheduledAt: { $lte: now },
  });
  const duePages = await Page.find({
    status: "scheduled",
    scheduledAt: { $lte: now },
  });

  for (const post of duePosts) {
    post.status = "published";
    post.publishedAt = post.publishedAt || now;
    post.scheduledAt = null;
    await post.save();
    revalidatePath(`/blog/${post.slug}`);
  }

  for (const page of duePages) {
    page.status = "published";
    page.publishedAt = page.publishedAt || now;
    page.scheduledAt = null;
    await page.save();
    revalidatePath(`/${page.slug}`);
  }

  if (duePosts.length || duePages.length) {
    revalidatePath("/");
    revalidatePath("/blog");
  }

  return NextResponse.json({
    publishedPosts: duePosts.length,
    publishedPages: duePages.length,
  });
}
