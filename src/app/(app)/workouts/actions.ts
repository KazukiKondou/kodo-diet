"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { keyToDate } from "@/lib/day"
import { fetchVideoTitle } from "@/lib/video-server"

const numOpt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((v) => (v === "" || v == null ? undefined : Number(v)))
  .refine((v) => v === undefined || Number.isFinite(v), "数値を入力してください")

const schema = z.object({
  date: z.string().min(1),
  exerciseTypeId: z.string().min(1, "種目を選んでください"),
  reps: numOpt,
  weightKg: numOpt,
  durMin: numOpt,
  durSec: numOpt,
  distanceKm: numOpt,
  note: z.string().max(200).optional(),
  useVideo: z.string().optional(),
  videoUrl: z.string().optional(),
  videoTitle: z.string().max(200).optional(),
})

export type WorkoutState = { ok?: boolean; error?: string } | null

export async function addWorkoutLog(_prev: WorkoutState, formData: FormData): Promise<WorkoutState> {
  const user = await requireUser()
  const parsed = schema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "入力エラー" }
  }
  const d = parsed.data
  const ex = await prisma.exerciseType.findUnique({ where: { id: d.exerciseTypeId } })
  if (!ex) return { error: "種目が見つかりません" }

  const date = keyToDate(d.date)

  // 動画（見てやった場合）
  let videoId: string | undefined
  if (d.useVideo === "on" && d.videoUrl && d.videoUrl.trim()) {
    const url = d.videoUrl.trim()
    const existing = await prisma.workoutVideo.findUnique({
      where: { userId_url: { userId: user.id, url } },
    })
    if (existing) {
      videoId = existing.id
    } else {
      const title = (d.videoTitle && d.videoTitle.trim()) || (await fetchVideoTitle(url)) || url
      const created = await prisma.workoutVideo.create({ data: { userId: user.id, url, title } })
      videoId = created.id
    }
  }

  const durationSec =
    d.durMin != null || d.durSec != null ? Math.round((d.durMin ?? 0) * 60 + (d.durSec ?? 0)) : undefined
  const distanceM = d.distanceKm != null ? Math.round(d.distanceKm * 1000) : undefined

  await prisma.workoutLog.create({
    data: {
      userId: user.id,
      date,
      exerciseTypeId: ex.id,
      reps: d.reps ?? null,
      weightKg: d.weightKg ?? null,
      durationSec: durationSec ?? null,
      distanceM: distanceM ?? null,
      note: d.note?.trim() || null,
      videoId: videoId ?? null,
    },
  })

  revalidatePath("/workouts")
  revalidatePath("/dashboard")
  return { ok: true }
}

export async function deleteWorkoutLog(id: string): Promise<void> {
  const user = await requireUser()
  await prisma.workoutLog.deleteMany({ where: { id, userId: user.id } })
  revalidatePath("/workouts")
  revalidatePath("/dashboard")
}
