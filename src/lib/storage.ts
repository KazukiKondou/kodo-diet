import fs from "node:fs/promises"
import path from "node:path"
import crypto from "node:crypto"
import sharp from "sharp"

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads")

export interface StoredImage {
  imagePath: string
  thumbPath: string
}

/** 画像を webp 化して本体＋サムネイルを保存。ファイル名は推測不能なUUID。 */
export async function saveImage(buffer: Buffer, opts?: { maxWidth?: number }): Promise<StoredImage> {
  await fs.mkdir(UPLOAD_DIR, { recursive: true })
  const id = crypto.randomUUID()
  const fullName = `${id}.webp`
  const thumbName = `${id}_thumb.webp`

  const full = await sharp(buffer)
    .rotate()
    .resize({ width: opts?.maxWidth ?? 1600, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer()
  const thumb = await sharp(buffer)
    .rotate()
    .resize({ width: 480, height: 480, fit: "cover" })
    .webp({ quality: 78 })
    .toBuffer()

  await fs.writeFile(path.join(UPLOAD_DIR, fullName), full)
  await fs.writeFile(path.join(UPLOAD_DIR, thumbName), thumb)
  return { imagePath: fullName, thumbPath: thumbName }
}

export async function deleteImage(...names: (string | null | undefined)[]): Promise<void> {
  await Promise.all(
    names.filter(Boolean).map(async (n) => {
      try {
        await fs.unlink(path.join(UPLOAD_DIR, path.basename(n as string)))
      } catch {
        // 既に無い場合は無視
      }
    }),
  )
}

/** 保存済み画像を読み出す。path traversal を防ぐため basename のみ使用。 */
export async function readImage(name: string): Promise<Buffer | null> {
  try {
    return await fs.readFile(path.join(UPLOAD_DIR, path.basename(name)))
  } catch {
    return null
  }
}
