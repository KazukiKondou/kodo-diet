// 種目カタログ（プルダウン初期値）。DBへ seed し、将来はユーザー追加も可能。
export type Metric = "REPS" | "WEIGHT_REPS" | "TIME" | "DISTANCE"

export interface ExerciseSeed {
  name: string
  category: string
  metric: Metric
  sortOrder: number
}

export const METRIC_LABEL: Record<Metric, string> = {
  REPS: "回数",
  WEIGHT_REPS: "重量 × 回数",
  TIME: "時間",
  DISTANCE: "距離",
}

/** その種目の記録で使う入力欄 */
export function metricFields(metric: Metric): Array<"reps" | "weightKg" | "durationSec" | "distanceM"> {
  switch (metric) {
    case "REPS":
      return ["reps"]
    case "WEIGHT_REPS":
      return ["weightKg", "reps"]
    case "TIME":
      return ["durationSec"]
    case "DISTANCE":
      return ["distanceM"]
  }
}

export const EXERCISE_CATALOG: ExerciseSeed[] = [
  { name: "ベンチプレス", category: "胸", metric: "WEIGHT_REPS", sortOrder: 10 },
  { name: "腕立て伏せ", category: "胸", metric: "REPS", sortOrder: 11 },
  { name: "ダンベルフライ", category: "胸", metric: "WEIGHT_REPS", sortOrder: 12 },
  { name: "チェストプレス", category: "胸", metric: "WEIGHT_REPS", sortOrder: 13 },
  { name: "懸垂", category: "背中", metric: "REPS", sortOrder: 20 },
  { name: "ラットプルダウン", category: "背中", metric: "WEIGHT_REPS", sortOrder: 21 },
  { name: "デッドリフト", category: "背中", metric: "WEIGHT_REPS", sortOrder: 22 },
  { name: "ベントオーバーロウ", category: "背中", metric: "WEIGHT_REPS", sortOrder: 23 },
  { name: "スクワット", category: "脚", metric: "WEIGHT_REPS", sortOrder: 30 },
  { name: "レッグプレス", category: "脚", metric: "WEIGHT_REPS", sortOrder: 31 },
  { name: "ランジ", category: "脚", metric: "REPS", sortOrder: 32 },
  { name: "カーフレイズ", category: "脚", metric: "REPS", sortOrder: 33 },
  { name: "ショルダープレス", category: "肩", metric: "WEIGHT_REPS", sortOrder: 40 },
  { name: "サイドレイズ", category: "肩", metric: "WEIGHT_REPS", sortOrder: 41 },
  { name: "アームカール", category: "腕", metric: "WEIGHT_REPS", sortOrder: 50 },
  { name: "トライセプスエクステンション", category: "腕", metric: "WEIGHT_REPS", sortOrder: 51 },
  { name: "クランチ(腹筋)", category: "腹", metric: "REPS", sortOrder: 60 },
  { name: "プランク", category: "腹", metric: "TIME", sortOrder: 61 },
  { name: "レッグレイズ", category: "腹", metric: "REPS", sortOrder: 62 },
  { name: "ランニング", category: "有酸素", metric: "DISTANCE", sortOrder: 70 },
  { name: "ウォーキング", category: "有酸素", metric: "DISTANCE", sortOrder: 71 },
  { name: "サイクリング", category: "有酸素", metric: "TIME", sortOrder: 72 },
  { name: "縄跳び", category: "有酸素", metric: "REPS", sortOrder: 73 },
  { name: "HIIT", category: "有酸素", metric: "TIME", sortOrder: 74 },
  { name: "バーピー", category: "全身", metric: "REPS", sortOrder: 80 },
]
