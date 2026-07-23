import { describe, it, expect } from "vitest"
import { toDateKey, parseDateKey, addDays, startOfWeek, lastNDays, weekRange } from "@/lib/dates"

describe("toDateKey / parseDateKey", () => {
  it("ゼロ埋めしたローカル日付キー", () => {
    expect(toDateKey(new Date(2026, 0, 5))).toBe("2026-01-05")
  })
  it("往復変換で一致", () => {
    expect(toDateKey(parseDateKey("2026-03-09"))).toBe("2026-03-09")
  })
})

describe("addDays", () => {
  it("月をまたいで加算、元は不変", () => {
    const base = new Date(2026, 0, 31)
    expect(toDateKey(addDays(base, 1))).toBe("2026-02-01")
    expect(toDateKey(base)).toBe("2026-01-31")
  })
})

describe("startOfWeek", () => {
  it("月曜始まり", () => {
    // 2026-07-24 は金曜 → 週開始は 2026-07-20(月)
    expect(toDateKey(startOfWeek(new Date(2026, 6, 24)))).toBe("2026-07-20")
  })
})

describe("lastNDays", () => {
  it("日数分・古い順・末尾が今日", () => {
    const keys = lastNDays(new Date(2026, 6, 24), 7)
    expect(keys).toHaveLength(7)
    expect(keys[6]).toBe("2026-07-24")
    expect(keys[0]).toBe("2026-07-18")
  })
})

describe("weekRange", () => {
  it("[月曜, 翌週月曜) を返す", () => {
    const { start, end } = weekRange(new Date(2026, 6, 24))
    expect(toDateKey(start)).toBe("2026-07-20")
    expect(toDateKey(end)).toBe("2026-07-27")
  })
})
