// 体組成まわりの純粋計算。UI/サーバ双方から使い、単体テストで担保する。

export const STANDARD_BMI = 22 // 標準体重の基準BMI（日本）

/** 小数第 digits 位に丸める */
export function roundTo(value: number, digits = 1): number {
  const f = 10 ** digits
  return Math.round(value * f) / f
}

/** BMI = 体重(kg) / 身長(m)^2 */
export function bmi(weightKg: number, heightCm: number): number {
  if (!(heightCm > 0)) {
    throw new Error("身長は正の値である必要があります")
  }
  const m = heightCm / 100
  return weightKg / (m * m)
}

export type BmiCategory = "low" | "normal" | "obese1" | "obese2" | "obese3" | "obese4"

/** 日本肥満学会(JASSO)基準の区分 */
export function bmiCategory(bmiValue: number): BmiCategory {
  if (bmiValue < 18.5) return "low"
  if (bmiValue < 25) return "normal"
  if (bmiValue < 30) return "obese1"
  if (bmiValue < 35) return "obese2"
  if (bmiValue < 40) return "obese3"
  return "obese4"
}

export const BMI_CATEGORY_LABEL: Record<BmiCategory, string> = {
  low: "低体重",
  normal: "普通体重",
  obese1: "肥満(1度)",
  obese2: "肥満(2度)",
  obese3: "肥満(3度)",
  obese4: "肥満(4度)",
}

/** 標準体重(kg) = 22 × 身長(m)^2 */
export function standardWeightKg(heightCm: number): number {
  if (!(heightCm > 0)) {
    throw new Error("身長は正の値である必要があります")
  }
  const m = heightCm / 100
  return STANDARD_BMI * m * m
}

/** 生年月日と基準日から満年齢を求める */
export function ageFromBirthDate(birthDate: Date, now: Date): number {
  let age = now.getFullYear() - birthDate.getFullYear()
  const monthDiff = now.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

/** 現在値 − 目標値（正なら超過、負なら不足） */
export function difference(current: number, target: number): number {
  return current - target
}
