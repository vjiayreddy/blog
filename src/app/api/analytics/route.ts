import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { AnalyticsEvent } from "@/models/AnalyticsEvent";
import { analyticsEventSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = analyticsEventSchema.parse(body);
    await connectDB();
    await AnalyticsEvent.create({
      type: data.type,
      path: data.path,
      postId: data.postId || null,
      referrer: data.referrer || "",
      userAgent: request.headers.get("user-agent") || "",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
}
