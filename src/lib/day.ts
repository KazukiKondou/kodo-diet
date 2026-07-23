// カレンダー日(YYYY-MM-DD)を軸に、DBの @db.Date と安全に往復する。
// 保存は UTC 0時に固定し、タイムゾーンによる日付ズレを防ぐ。表示上の「今日」は既定で JST。

const DEFAULT_TZ = process.env.APP_TZ || "Asia/Tokyo"

/** 指定TZの「今日」を YYYY-MM-DD で返す */
export function todayKey(tz: string = DEFAULT_TZ): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

/** YYYY-MM-DD → UTC0時のDate（DB保存用） */
export function keyToDate(key: string): Date {
  return new Date(`${key}T00:00:00.000Z`)
}

/** DBのDate → YYYY-MM-DD（UTC基準で安定） */
export function dateToKey(d: Date): string {
  return d.toISOString().slice(0, 10)
}

/** 日付キーに日数を加算 */
export function addDaysKey(key: string, days: number): string {
  const d = keyToDate(key)
  d.setUTCDate(d.getUTCDate() + days)
  return dateToKey(d)
}

/** endKey を末尾に、過去 n 日分のキー（古い→新しい） */
export function lastNDayKeys(n: number, endKey: string = todayKey()): string[] {
  const keys: string[] = []
  for (let i = n - 1; i >= 0; i--) keys.push(addDaysKey(endKey, -i))
  return keys
}

/** その週の月曜（既定）のキー */
export function startOfWeekKey(key: string, weekStartsOn = 1): string {
  const d = keyToDate(key)
  const day = d.getUTCDay()
  const diff = (day - weekStartsOn + 7) % 7
  return addDaysKey(key, -diff)
}
