import { getAdminSettings } from "@/app/actions/media-settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return <SettingsForm initial={settings} />;
}
