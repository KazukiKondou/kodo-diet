import { redirect } from "next/navigation"
import { getCurrentUser, needsOnboarding } from "@/lib/session"
import { Nav } from "@/components/Nav"

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  if (needsOnboarding(user)) redirect("/onboarding")

  return (
    <div className="min-h-full pb-24 sm:pb-8">
      <Nav
        user={{ iconType: user.iconType, iconEmoji: user.iconEmoji, image: user.image, name: user.name }}
      />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </div>
  )
}
