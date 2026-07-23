import { requireUser } from "@/lib/session"
import { SettingsForm } from "./SettingsForm"

export const metadata = { title: "設定" }

export default async function SettingsPage() {
  const user = await requireUser()
  return (
    <div className="space-y-5">
      <h1 className="section-title text-2xl">設定</h1>
      <SettingsForm
        user={{
          name: user.name ?? "",
          email: user.email,
          iconType: user.iconType,
          iconEmoji: user.iconEmoji,
          image: user.image,
          heatmapColor: user.heatmapColor,
          goalWeightKg: user.goalWeightKg,
          declaration: user.declaration,
        }}
      />
    </div>
  )
}
