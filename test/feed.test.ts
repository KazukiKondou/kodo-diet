import { describe, it, expect } from "vitest"
import { isWithinLastHours, filterFeed, FEED_WINDOW_HOURS } from "@/lib/feed"

const now = new Date("2026-07-24T20:00:00Z")

describe("isWithinLastHours", () => {
  it("N時間以内はtrue、超過はfalse", () => {
    expect(isWithinLastHours(new Date("2026-07-24T19:59:00Z"), now, 5)).toBe(true)
    expect(isWithinLastHours(new Date("2026-07-24T15:00:00Z"), now, 5)).toBe(true) // ちょうど5h
    expect(isWithinLastHours(new Date("2026-07-24T14:59:00Z"), now, 5)).toBe(false)
  })
  it("未来はfalse", () => {
    expect(isWithinLastHours(new Date("2026-07-24T20:01:00Z"), now, 5)).toBe(false)
  })
})

describe("filterFeed", () => {
  it("既定は直近5時間", () => {
    expect(FEED_WINDOW_HOURS).toBe(5)
  })
  it("共有済みかつ範囲内のみ、新しい順で返す", () => {
    const items = [
      { id: "a", sharedAt: new Date("2026-07-24T19:00:00Z") },
      { id: "b", sharedAt: null }, // 非共有
      { id: "c", sharedAt: new Date("2026-07-24T10:00:00Z") }, // 範囲外
      { id: "d", sharedAt: new Date("2026-07-24T19:30:00Z") },
    ]
    const result = filterFeed(items, now)
    expect(result.map((r) => r.id)).toEqual(["d", "a"])
  })
  it("入力配列を破壊しない", () => {
    const items = [
      { id: "a", sharedAt: new Date("2026-07-24T18:00:00Z") },
      { id: "d", sharedAt: new Date("2026-07-24T19:30:00Z") },
    ]
    const snapshot = items.map((i) => i.id)
    filterFeed(items, now)
    expect(items.map((i) => i.id)).toEqual(snapshot)
  })
})
