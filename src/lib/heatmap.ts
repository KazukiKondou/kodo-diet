// GitHub / Claude 風の活動ヒートマップ。強度レベルと配色プリセットを提供する。

export const HEATMAP_LEVELS = 5 // レベル0(無し)〜4(最大)

/**
 * その日の活動量(件数)から強度レベル0..4を決定する。
 * thresholds はレベル1..4に到達する最小件数（昇順）。
 */
export function intensityLevel(count: number, thresholds: number[] = [1, 2, 4, 6]): number {
  if (count <= 0) return 0
  let level = 0
  for (let i = 0; i < thresholds.length; i++) {
    if (count >= thresholds[i]) level = i + 1
  }
  return Math.min(level, thresholds.length)
}

export interface HeatmapPalette {
  key: string
  label: string
  /** レベル0..4に対応する5色 */
  colors: [string, string, string, string, string]
}

// 茶系をメインに、Z世代好みのウォームな配色を複数用意（ユーザーが選択可）。
export const HEATMAP_PALETTES: Record<string, HeatmapPalette> = {
  brown: {
    key: "brown",
    label: "ブラウン",
    colors: ["#efe6db", "#e3c9a3", "#cfa06a", "#a9713a", "#6f4318"],
  },
  coffee: {
    key: "coffee",
    label: "コーヒー",
    colors: ["#ece5df", "#d7c2ad", "#b1906f", "#7d5a3c", "#432818"],
  },
  terracotta: {
    key: "terracotta",
    label: "テラコッタ",
    colors: ["#f2e7df", "#eec6ab", "#e0996f", "#c56b40", "#8a3d1c"],
  },
  matcha: {
    key: "matcha",
    label: "抹茶",
    colors: ["#eae7db", "#cdd6a8", "#a3bd6f", "#6f8f45", "#3f5a22"],
  },
  berry: {
    key: "berry",
    label: "ベリー",
    colors: ["#efe3e6", "#e6bcc8", "#d187a0", "#a85674", "#6d2c46"],
  },
}

export const DEFAULT_PALETTE_KEY = "brown"

/** 未知キーはブラウンにフォールバック */
export function paletteFor(key: string | null | undefined): HeatmapPalette {
  if (key && HEATMAP_PALETTES[key]) return HEATMAP_PALETTES[key]
  return HEATMAP_PALETTES[DEFAULT_PALETTE_KEY]
}

export function paletteKeys(): string[] {
  return Object.keys(HEATMAP_PALETTES)
}
