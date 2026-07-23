import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { bmi, bmiCategory, BMI_CATEGORY_LABEL, standardWeightKg, difference, roundTo } from "@/lib/calc"
import { dateToKey, todayKey } from "@/lib/day"
import { fmtKg, signed } from "@/lib/format"
import { WeightForm } from "./WeightForm"
import { WeightChart } from "./WeightChart"

export const metadata = { title: "体重" }

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl bg-sand/60 px-4 py-3">
      <p className="text-xs font-semibold text-muted">{label}</p>
      <p className="mt-0.5 font-[family-name:var(--font-display)] text-xl font-bold text-ink">{value}</p>
      {sub && <p className="text-xs text-muted">{sub}</p>}
    </div>
  )
}

export default async function WeightPage() {
  const user = await requireUser()
  const entries = await prisma.weightEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  })
  const points = entries.map((e) => ({ key: dateToKey(e.date), weightKg: e.weightKg }))
  const latest = entries.at(-1)
  const height = user.heightCm ?? 170
  const today = todayKey()
  const todayEntry = entries.find((e) => dateToKey(e.date) === today)

  const current = latest?.weightKg ?? null
  const bmiValue = current != null ? bmi(current, height) : null
  const std = standardWeightKg(height)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl">体重</h1>
        <p className="mt-1 text-sm text-muted">毎日の体重を記録して、理想との差を見える化。</p>
      </div>

      <div className="card">
        <WeightForm todayKey={today} defaultWeight={todayEntry?.weightKg} />
      </div>

      {current != null && bmiValue != null ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat label="現在の体重" value={fmtKg(current)} sub={latest ? dateToKey(latest.date) : undefined} />
          <Stat
            label="BMI"
            value={`${roundTo(bmiValue, 1)}`}
            sub={BMI_CATEGORY_LABEL[bmiCategory(bmiValue)]}
          />
          <Stat
            label="標準体重との差"
            value={`${signed(difference(current, std))}kg`}
            sub={`標準 ${fmtKg(std)}`}
          />
          <Stat
            label="目標との差"
            value={user.goalWeightKg != null ? `${signed(difference(current, user.goalWeightKg))}kg` : "—"}
            sub={user.goalWeightKg != null ? `目標 ${fmtKg(user.goalWeightKg)}` : "目標未設定"}
          />
        </div>
      ) : (
        <div className="card text-center text-sm text-muted">
          最初の体重を記録すると、BMIや目標との差が表示されます。
        </div>
      )}

      <div className="card">
        <div className="mb-2 flex items-center justify-between">
          <p className="section-title text-base">推移</p>
          <span className="chip">{points.length}日分</span>
        </div>
        <WeightChart points={points} goal={user.goalWeightKg} />
      </div>
    </div>
  )
}
