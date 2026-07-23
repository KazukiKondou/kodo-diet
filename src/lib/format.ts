import { roundTo } from "./calc"

/** kg 表記（小数1桁） */
export function fmtKg(n: number): string {
  return `${roundTo(n, 1)}kg`
}

/** 符号付き（+/-）小数1桁 */
export function signed(n: number, digits = 1): string {
  const r = roundTo(n, digits)
  return r > 0 ? `+${r}` : `${r}`
}

/** 秒 → 「m分s秒」/「s秒」 */
export function fmtDuration(sec: number): string {
  if (sec >= 60) {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return s ? `${m}分${s}秒` : `${m}分`
  }
  return `${sec}秒`
}

/** メートル → 「x.xkm」/「xm」 */
export function fmtDistance(m: number): string {
  return m >= 1000 ? `${roundTo(m / 1000, 2)}km` : `${m}m`
}
