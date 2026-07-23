import { describe, it, expect } from "vitest"
import { intensityLevel, paletteFor, HEATMAP_PALETTES, DEFAULT_PALETTE_KEY } from "@/lib/heatmap"

describe("intensityLevel", () => {
  it("0件はレベル0", () => {
    expect(intensityLevel(0)).toBe(0)
    expect(intensityLevel(-3)).toBe(0)
  })
  it("既定しきい値[1,2,4,6]で段階化する", () => {
    expect(intensityLevel(1)).toBe(1)
    expect(intensityLevel(2)).toBe(2)
    expect(intensityLevel(3)).toBe(2)
    expect(intensityLevel(4)).toBe(3)
    expect(intensityLevel(5)).toBe(3)
    expect(intensityLevel(6)).toBe(4)
    expect(intensityLevel(100)).toBe(4)
  })
})

describe("paletteFor", () => {
  it("既知キーはそのパレット", () => {
    expect(paletteFor("coffee").key).toBe("coffee")
  })
  it("未知キー/未指定はブラウンにフォールバック", () => {
    expect(paletteFor("unknown").key).toBe(DEFAULT_PALETTE_KEY)
    expect(paletteFor(null).key).toBe(DEFAULT_PALETTE_KEY)
    expect(paletteFor(undefined).key).toBe(DEFAULT_PALETTE_KEY)
  })
  it("各パレットは5色", () => {
    for (const p of Object.values(HEATMAP_PALETTES)) {
      expect(p.colors).toHaveLength(5)
    }
  })
})
