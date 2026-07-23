"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { saveImage, deleteImage } from "@/lib/storage"

const MAX_BYTES = 12 * 1024 * 1024
export type BodyState = { ok?: boolean; error?: string } | null

export async function uploadBody(_prev: BodyState, formData: FormData): Promise<BodyState> {
  const user = await requireUser()
  const file = formData.get("photo")
  if (!(file instanceof File) || file.size === 0) return { error: "写真を選んでください" }
  if (!file.type.startsWith("image/")) return { error: "画像ファイルを選んでください" }
  if (file.size > MAX_BYTES) return { error: "12MB以下の画像にしてください" }

  const note = z.string().max(140).optional().parse((formData.get("note") as string) || undefined)
  const buf = Buffer.from(await file.arrayBuffer())
  const { imagePath, thumbPath } = await saveImage(buf)

  await prisma.bodyPhoto.create({ data: { userId: user.id, imagePath, thumbPath, note: note || null } })
  revalidatePath("/body")
  return { ok: true }
}

export async function deleteBody(id: string): Promise<void> {
  const user = await requireUser()
  const p = await prisma.bodyPhoto.findUnique({ where: { id } })
  if (!p || p.userId !== user.id) return
  await prisma.bodyPhoto.delete({ where: { id } })
  await deleteImage(p.imagePath, p.thumbPath)
  revalidatePath("/body")
}
