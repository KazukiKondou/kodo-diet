import { describe, it, expect } from "vitest"
import {
  bmi,
  bmiCategory,
  standardWeightKg,
  ageFromBirthDate,
  difference,
  roundTo,
  BMI_CATEGORY_LABEL,
} from "@/lib/calc"

describe("bmi", () => {
  it("身長170cm・体重68kgのBMIを算出する", () => {
    expect(roundTo(bmi(68, 170), 1)).toBe(23.5)
  })

  it("身長が0以下なら例外を投げる", () => {
    expect(() => bmi(60, 0)).toThrow()
    expect(() => bmi(60, -10)).toThrow()
  })
})

describe("bmiCategory (JASSO)", () => {
  it("境界値を正しく区分する", () => {
    expect(bmiCategory(18.4)).toBe("low")
    expect(bmiCategory(18.5)).toBe("normal")
    expect(bmiCategory(24.9)).toBe("normal")
    expect(bmiCategory(25)).toBe("obese1")
    expect(bmiCategory(30)).toBe("obese2")
    expect(bmiCategory(35)).toBe("obese3")
    expect(bmiCategory(40)).toBe("obese4")
  })

  it("全区分に日本語ラベルがある", () => {
    for (const key of ["low", "normal", "obese1", "obese2", "obese3", "obese4"] as const) {
      expect(BMI_CATEGORY_LABEL[key]).toBeTruthy()
    }
  })
})

describe("standardWeightKg", () => {
  it("身長170cmの標準体重は約63.6kg", () => {
    expect(roundTo(standardWeightKg(170), 1)).toBe(63.6)
  })
})

describe("ageFromBirthDate", () => {
  it("誕生日前は1歳引く", () => {
    const birth = new Date(2000, 5, 15) // 6/15
    expect(ageFromBirthDate(birth, new Date(2026, 5, 14))).toBe(25)
    expect(ageFromBirthDate(birth, new Date(2026, 5, 15))).toBe(26)
  })
})

describe("difference", () => {
  it("現在−目標を返す", () => {
    expect(difference(70, 65)).toBe(5)
    expect(difference(60, 65)).toBe(-5)
  })
})
