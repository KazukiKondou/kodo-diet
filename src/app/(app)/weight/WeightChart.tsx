"use client"

export interface WeightPoint {
  key: string
  weightKg: number
}

export function WeightChart({ points, goal }: { points: WeightPoint[]; goal?: number | null }) {
  if (points.length === 0) {
    return <p className="py-8 text-center text-sm text-muted">まだ記録がありません。今日の体重を入れてみましょう。</p>
  }

  const W = 320
  const H = 140
  const pad = 8
  const weights = points.map((p) => p.weightKg)
  const values = goal != null ? [...weights, goal] : weights
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const n = points.length

  const x = (i: number) => (n === 1 ? W / 2 : pad + (i * (W - pad * 2)) / (n - 1))
  const y = (v: number) => pad + (H - pad * 2) * (1 - (v - min) / range)

  const line = points.map((p, i) => `${x(i)},${y(p.weightKg)}`).join(" ")
  const area = `${pad},${H - pad} ${line} ${W - pad},${H - pad}`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a9713a" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#a9713a" stopOpacity="0" />
        </linearGradient>
      </defs>
      {goal != null && (
        <line x1={pad} x2={W - pad} y1={y(goal)} y2={y(goal)} stroke="#6f8f45" strokeWidth="1.5" strokeDasharray="4 4" />
      )}
      <polygon points={area} fill="url(#wg)" />
      <polyline points={line} fill="none" stroke="#a9713a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <circle key={p.key} cx={x(i)} cy={y(p.weightKg)} r={n > 40 ? 1.5 : 2.6} fill="#8c5a2c" />
      ))}
    </svg>
  )
}
