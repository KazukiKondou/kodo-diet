"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { saveImage } from "@/lib/storage"
import { paletteKeys } from "@/lib/heatmap"

const numOpt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === "" || v == null ? undefined : Number(v)))

const schema = z.object({
  name: z.string().min(1, "ユーザー名を入力してください").max(30),
  iconType: z.enum(["EMOJI", "PHOTO"]),
  iconEmoji: z.string().max(8).optional(),
  heatmapColor: z.string(),
  goalWeightKg: numOpt,
  declaration: z.string().max(140).optional(),
})

export type SettingsState = { ok?: boolean; error?: string } | null

export async function updateProfile(_prev: SettingsState, formData: FormData): Promise<SettingsState> {
  const user = await requireUser()
  const parsed = schema.safeParse({
    name: formData.get("name"),
    iconType: formData.get("iconType"),
    iconEmoji: (formData.get("iconEmoji") as string) || undefined,
    heatmapColor: formData.get("heatmapColor"),
    goalWeightKg: (formData.get("goalWeightKg") as string) || undefined,
    declaration: (formData.get("declaration") as string) || undefined,
  })
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  const d = parsed.data
  if (!paletteKeys().includes(d.heatmapColor)) return { error: "配色が不正です" }

  let image = user.image
  const file = formData.get("photo")
  if (d.iconType === "PHOTO" && file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "画像ファイルを選んでください" }
    const buf = Buffer.from(await file.arrayBuffer())
    const { thumbPath } = await saveImage(buf, { maxWidth: 512 })
    image = `/api/uploads/${thumbPath}`
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      name: d.name,
      iconType: d.iconType,
      iconEmoji: d.iconEmoji || user.iconEmoji,
      image,
      heatmapColor: d.heatmapColor,
      goalWeightKg: d.goalWeightKg ?? null,
      declaration: d.declaration || null,
    },
  })
  revalidatePath("/settings")
  revalidatePath("/dashboard")
  return { ok: true }
}
