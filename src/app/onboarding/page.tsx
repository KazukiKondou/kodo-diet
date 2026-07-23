import { redirect } from "next/navigation"
import { BrandMark } from "@/components/BrandMark"
import { requireUser, needsOnboarding } from "@/lib/session"
import { OnboardingForm } from "./OnboardingForm"

export const metadata = { title: "はじめよう" }

export default async function OnboardingPage() {
  const user = await requireUser()
  if (!needsOnboarding(user)) redirect("/dashboard")

  return (
    <main className="mx-auto flex min-h-full max-w-md flex-col justify-center px-5 py-10">
      <div className="mx-auto">
        <BrandMark size={30} />
      </div>
      <div className="card mt-6">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-ink">はじめの一歩</h1>
        <p className="mt-1 text-sm text-muted">BMIや目標との差を計算するために、少しだけ教えてください。</p>
        <OnboardingForm />
      </div>
    </main>
  )
}
