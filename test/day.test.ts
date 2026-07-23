import { describe, it, expect } from "vitest"
import { keyToDate, dateToKey, addDaysKey, lastNDayKeys, startOfWeekKey } from "@/lib/day"

describe("keyToDate / dateToKey", () => {
  it("UTC0時で往復する（TZに依存しない）", () => {
    expect(keyToDate("2026-07-24").toISOString()).toBe("2026-07-24T00:00:00.000Z")
    expect(dateToKey(keyToDate("2026-07-24"))).toBe("2026-07-24")
  })
})

describe("addDaysKey", () => {
  it("月をまたいで加減算", () => {
    expect(addDaysKey("2026-01-31", 1)).toBe("2026-02-01")
    expect(addDaysKey("2026-03-01", -1)).toBe("2026-02-28")
  })
})

describe("lastNDayKeys", () => {
  it("末尾=endKey、古い順、長さn", () => {
    const keys = lastNDayKeys(7, "2026-07-24")
    expect(keys).toHaveLength(7)
    expect(keys[6]).toBe("2026-07-24")
    expect(keys[0]).toBe("2026-07-18")
  })
})

describe("startOfWeekKey", () => {
  it("2026-07-24(金)の週開始は月曜2026-07-20", () => {
    expect(startOfWeekKey("2026-07-24")).toBe("2026-07-20")
  })
})
