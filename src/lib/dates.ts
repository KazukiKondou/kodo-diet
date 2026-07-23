// ローカル日付ユーティリティ。DBの @db.Date（YYYY-MM-DD）と整合させる。

/** ローカル日付キー YYYY-MM-DD */
export function toDateKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

export function parseDateKey(key: string): Date {
  const [y, m, d] = key.split("-").map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(d: Date, days: number): Date {
  const r = new Date(d)
  r.setDate(r.getDate() + days)
  return r
}

/** 週の開始（既定は月曜） */
export function startOfWeek(d: Date, weekStartsOn = 1): Date {
  const r = new Date(d.getFullYear(), d.getMonth(), d.getDate())
  const day = r.getDay()
  const diff = (day - weekStartsOn + 7) % 7
  return addDays(r, -diff)
}

/** 過去 days 日分の日付キー（古い→新しい、末尾が今日） */
export function lastNDays(now: Date, days: number): string[] {
  const keys: string[] = []
  const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  for (let i = days - 1; i >= 0; i--) keys.push(toDateKey(addDays(base, -i)))
  return keys
}

/** 週範囲 [start, end)（endは翌週開始） */
export function weekRange(d: Date, weekStartsOn = 1): { start: Date; end: Date } {
  const start = startOfWeek(d, weekStartsOn)
  return { start, end: addDays(start, 7) }
}
