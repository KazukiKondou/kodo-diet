import Link from "next/link"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { bmi, bmiCategory, BMI_CATEGORY_LABEL, difference, roundTo, standardWeightKg } from "@/lib/calc"
import { keyToDate, dateToKey, todayKey, startOfWeekKey, addDaysKey } from "@/lib/day"
import { fmtKg, signed } from "@/lib/format"
import { Avatar } from "@/components/Avatar"
import { Heatmap } from "@/components/Heatmap"

export const metadata = { title: "ホーム" }

const HEATMAP_WEEKS = 17

function Tile({ label, value, sub, href }: { label: string; value: string; sub?: string; href: string }) {
  return (
    <Link href={href} className="card block transition hover:-translate-y-0.5">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </Link>
  )
}

export default async function DashboardPage() {
  const user = await requireUser()
  const today = todayKey()
  const weekStart = keyToDate(startOfWeekKey(today))

  const [latest, todayLogCount, weekMealCount, rangeLogs] = await Promise.all([
    prisma.weightEntry.findFirst({ where: { userId: user.id }, orderBy: { date: "desc" } }),
    prisma.workoutLog.count({ where: { userId: user.id, date: keyToDate(today) } }),
    prisma.mealPhoto.count({ where: { userId: user.id, eatenAt: { gte: weekStart } } }),
    prisma.workoutLog.findMany({
      where: { userId: user.id, date: { gte: keyToDate(addDaysKey(startOfWeekKey(today), -(HEATMAP_WEEKS - 1) * 7)) } },
      select: { date: true },
    }),
  ])

  const counts: Record<string, number> = {}
  for (const l of rangeLogs) {
    const k = dateToKey(l.date)
    counts[k] = (counts[k] ?? 0) + 1
  }

  const height = user.heightCm ?? 170
  const current = latest?.weightKg ?? null
  const bmiValue = current != null ? bmi(current, height) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Avatar user={user} size={48} />
        <div>
          <h1 className="section-title text-xl">こんにちは、{user.name ?? "あなた"}さん</h1>
          <p className="text-sm text-muted">{today}・今日もいい一日に。</p>
        </div>
      </div>

      {user.declaration && (
        <div className="rounded-[var(--radius-xl2)] bg-primary px-5 py-4 text-white shadow-[var(--shadow-warm)]">
          <p className="text-xs font-semibold text-white/70">わたしの宣言</p>
          <p className="mt-1 font-[family-name:var(--font-display)] text-lg font-bold">“{user.declaration}”</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Tile
          label="現在の体重"
          value={current != null ? fmtKg(current) : "—"}
          sub={current != null && bmiValue != null ? `BMI ${roundTo(bmiValue, 1)}・${BMI_CATEGORY_LABEL[bmiCategory(bmiValue)]}` : "記録する →"}
          href="/weight"
        />
        <Tile
          label="目標との差"
          value={current != null && user.goalWeightKg != null ? `${signed(difference(current, user.goalWeightKg))}kg` : "—"}
          sub={user.goalWeightKg != null ? `目標 ${fmtKg(user.goalWeightKg)}` : "目標を設定 →"}
          href="/settings"
        />
        <Tile label="今日の運動" value={`${todayLogCount}種目`} sub="運動を記録 →" href="/workouts" />
        <Tile label="今週の食事" value={`${weekMealCount}枚`} sub="写真を追加 →" href="/meals" />
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-title text-base">運動の記録</p>
          <Link href="/workouts" className="text-sm font-semibold text-primary">すべて見る →</Link>
        </div>
        <Heatmap counts={counts} weeks={HEATMAP_WEEKS} paletteKey={user.heatmapColor} />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Link href="/weight" className="btn-outline py-3">⚖️ 体重</Link>
        <Link href="/workouts" className="btn-outline py-3">💪 運動</Link>
        <Link href="/meals" className="btn-outline py-3">🍽️ 食事</Link>
      </div>
    </div>
  )
}
