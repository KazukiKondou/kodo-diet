import { paletteFor, intensityLevel } from "@/lib/heatmap"
import { todayKey, startOfWeekKey, addDaysKey } from "@/lib/day"

export function Heatmap({
  counts,
  weeks = 17,
  paletteKey,
}: {
  counts: Record<string, number>
  weeks?: number
  paletteKey: string
}) {
  const palette = paletteFor(paletteKey)
  const today = todayKey()
  const startMon = addDaysKey(startOfWeekKey(today), -(weeks - 1) * 7)

  const cols = Array.from({ length: weeks }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => {
      const key = addDaysKey(startMon, w * 7 + d)
      const future = key > today
      const c = counts[key] ?? 0
      return { key, c, level: intensityLevel(c), future }
    }),
  )

  return (
    <div>
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-[3px]">
          {cols.map((col, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {col.map((cell) => (
                <div
                  key={cell.key}
                  title={`${cell.key}・${cell.c}種目`}
                  className="h-3.5 w-3.5 rounded-[4px]"
                  style={{ backgroundColor: cell.future ? "transparent" : palette.colors[cell.level] }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-muted">
        <span>少</span>
        {palette.colors.map((c, i) => (
          <span key={i} className="h-3 w-3 rounded-[3px]" style={{ backgroundColor: c }} />
        ))}
        <span>多</span>
      </div>
    </div>
  )
}
