import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { FEED_WINDOW_HOURS } from "@/lib/feed"
import { Avatar } from "@/components/Avatar"
import { deleteMeal, setMealShared } from "../meals/actions"

export const metadata = { title: "共有" }

function timeAgo(d: Date): string {
  const min = Math.floor((Date.now() - d.getTime()) / 60000)
  if (min < 1) return "たった今"
  if (min < 60) return `${min}分前`
  return `${Math.floor(min / 60)}時間前`
}

export default async function FeedPage() {
  const user = await requireUser()
  const since = new Date(Date.now() - FEED_WINDOW_HOURS * 3600_000)

  const meals = await prisma.mealPhoto.findMany({
    where: { sharedAt: { gte: since } },
    orderBy: { sharedAt: "desc" },
    include: { user: { select: { id: true, name: true, iconType: true, iconEmoji: true, image: true } } },
  })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="section-title text-2xl">みんなの食事</h1>
        <p className="mt-1 text-sm text-muted">直近{FEED_WINDOW_HOURS}時間の投稿。見られてると思うと、選ぶものが変わるかも👀</p>
      </div>

      {meals.length === 0 ? (
        <div className="card text-center text-sm text-muted">
          いまは共有された食事がありません。あなたが最初に投稿してみる？
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {meals.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="relative aspect-square bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/uploads/${m.thumbPath}`} alt={m.caption ?? "食事"} className="h-full w-full object-cover" />
              </div>
              <div className="flex items-center gap-2 px-3 py-2">
                <Avatar user={m.user} size={22} />
                <span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink">{m.user.name ?? "だれか"}</span>
                <span className="shrink-0 text-[10px] text-muted">{m.sharedAt ? timeAgo(m.sharedAt) : ""}</span>
              </div>
              {m.caption && <p className="truncate px-3 pb-2 text-xs text-muted">{m.caption}</p>}
              {m.userId === user.id && (
                <div className="flex gap-1 border-t border-line px-3 py-1.5">
                  <form action={setMealShared.bind(null, m.id, false)} className="flex-1">
                    <button className="w-full rounded-full py-1 text-[11px] font-bold text-muted hover:bg-sand">フィードから外す</button>
                  </form>
                  <form action={deleteMeal.bind(null, m.id)} className="flex-1">
                    <button className="w-full rounded-full py-1 text-[11px] font-bold text-accent hover:bg-sand">削除</button>
                  </form>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
