import Link from "next/link"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { keyToDate, dateToKey, todayKey, startOfWeekKey, addDaysKey } from "@/lib/day"
import { fmtDuration, fmtDistance } from "@/lib/format"
import { Heatmap } from "@/components/Heatmap"
import { WorkoutForm, type ExerciseOption } from "./WorkoutForm"
import { deleteWorkoutLog } from "./actions"

export const metadata = { title: "運動" }

const HEATMAP_WEEKS = 17

function metricSummary(log: {
  reps: number | null
  weightKg: number | null
  durationSec: number | null
  distanceM: number | null
}): string {
  const parts: string[] = []
  if (log.weightKg != null) parts.push(`${log.weightKg}kg`)
  if (log.reps != null) parts.push(`${log.reps}回`)
  if (log.durationSec != null) parts.push(fmtDuration(log.durationSec))
  if (log.distanceM != null) parts.push(fmtDistance(log.distanceM))
  return parts.join(" × ") || "記録"
}

export default async function WorkoutsPage() {
  const user = await requireUser()
  const today = todayKey()

  const [exercises, todayLogs, videos, rangeLogs] = await Promise.all([
    prisma.exerciseType.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }] }),
    prisma.workoutLog.findMany({
      where: { userId: user.id, date: keyToDate(today) },
      include: { exerciseType: true, video: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.workoutVideo.findMany({
      where: { userId: user.id },
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.workoutLog.findMany({
      where: {
        userId: user.id,
        date: { gte: keyToDate(addDaysKey(startOfWeekKey(today), -(HEATMAP_WEEKS - 1) * 7)) },
      },
      select: { date: true },
    }),
  ])

  const counts: Record<string, number> = {}
  for (const l of rangeLogs) {
    const k = dateToKey(l.date)
    counts[k] = (counts[k] ?? 0) + 1
  }

  const options: ExerciseOption[] = exercises.map((e) => ({
    id: e.id,
    name: e.name,
    category: e.category,
    metric: e.metric,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl">運動</h1>
        <p className="mt-1 text-sm text-muted">今日やった種目を記録しよう。続けた日はカレンダーに色がつきます。</p>
      </div>

      <div className="card">
        <p className="section-title mb-3 text-base">今日の記録を追加</p>
        <WorkoutForm exercises={options} todayKey={today} />
      </div>

      <div className="card">
        <p className="section-title mb-3 text-base">活動カレンダー</p>
        <Heatmap counts={counts} weeks={HEATMAP_WEEKS} paletteKey={user.heatmapColor} />
      </div>

      <div className="card">
        <p className="section-title mb-3 text-base">今日の種目（{todayLogs.length}）</p>
        {todayLogs.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted">まだありません。上のフォームから追加してね。</p>
        ) : (
          <ul className="space-y-2">
            {todayLogs.map((log) => (
              <li key={log.id} className="flex items-center justify-between rounded-2xl bg-sand/50 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="font-semibold text-ink">
                    {log.exerciseType.name}{" "}
                    <span className="text-sm font-normal text-muted">{metricSummary(log)}</span>
                  </p>
                  {log.video && (
                    <a href={log.video.url} target="_blank" rel="noreferrer" className="truncate text-xs text-primary underline">
                      🎬 {log.video.title}
                    </a>
                  )}
                  {log.note && <p className="truncate text-xs text-muted">{log.note}</p>}
                </div>
                <form action={deleteWorkoutLog.bind(null, log.id)}>
                  <button className="ml-2 shrink-0 rounded-full px-2 py-1 text-xs text-muted hover:bg-sand hover:text-accent" aria-label="削除">
                    削除
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="card">
        <p className="section-title mb-3 text-base">動画メニューの累積</p>
        {videos.length === 0 ? (
          <p className="py-3 text-center text-sm text-muted">動画を見ながらやると、ここに累積回数が出ます。</p>
        ) : (
          <ul className="space-y-2">
            {videos.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-2xl bg-sand/50 px-4 py-2.5">
                <a href={v.url} target="_blank" rel="noreferrer" className="min-w-0 truncate text-sm font-semibold text-ink hover:text-primary">
                  🎬 {v.title}
                </a>
                <span className="chip shrink-0">{v._count.logs}回</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
