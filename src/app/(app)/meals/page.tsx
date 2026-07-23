import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { keyToDate, dateToKey, todayKey, startOfWeekKey } from "@/lib/day"
import { MealUpload } from "./MealUpload"
import { Slideshow } from "./Slideshow"
import { deleteMeal, setMealShared } from "./actions"

export const metadata = { title: "食事" }

export default async function MealsPage() {
  const user = await requireUser()
  const weekStart = keyToDate(startOfWeekKey(todayKey()))

  const meals = await prisma.mealPhoto.findMany({
    where: { userId: user.id, eatenAt: { gte: weekStart } },
    orderBy: { eatenAt: "desc" },
  })

  const slides = [...meals]
    .reverse()
    .map((m) => ({ full: `/api/uploads/${m.imagePath}`, caption: m.caption, date: dateToKey(m.eatenAt) }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl">食事</h1>
        <p className="mt-1 text-sm text-muted">食べたものを写真で記録。週末にまとめて振り返ろう。</p>
      </div>

      <div className="card">
        <MealUpload />
      </div>

      <div className="card">
        <div className="mb-3 flex items-center justify-between">
          <p className="section-title text-base">今週の食事（{meals.length}）</p>
        </div>
        {meals.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">まだありません。今日の食事を撮ってみよう📷</p>
        ) : (
          <>
            <div className="mb-4">
              <Slideshow items={slides} />
            </div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
              {meals.map((m) => (
                <div key={m.id} className="group relative aspect-square overflow-hidden rounded-2xl bg-sand">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/api/uploads/${m.thumbPath}`} alt={m.caption ?? "食事"} className="h-full w-full object-cover" />
                  {m.sharedAt && (
                    <span className="absolute left-1 top-1 rounded-full bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-white">共有中</span>
                  )}
                  <div className="absolute inset-x-0 bottom-0 flex justify-between gap-1 bg-gradient-to-t from-ink/70 to-transparent p-1 opacity-0 transition group-hover:opacity-100">
                    <form action={setMealShared.bind(null, m.id, !m.sharedAt)}>
                      <button className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-ink">
                        {m.sharedAt ? "共有やめる" : "共有する"}
                      </button>
                    </form>
                    <form action={deleteMeal.bind(null, m.id)}>
                      <button className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-accent">削除</button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
