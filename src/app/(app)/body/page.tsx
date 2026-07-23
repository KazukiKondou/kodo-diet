import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { dateToKey } from "@/lib/day"
import { BodyUpload } from "./BodyUpload"
import { deleteBody } from "./actions"

export const metadata = { title: "体の記録" }

export default async function BodyPage() {
  const user = await requireUser()
  const photos = await prisma.bodyPhoto.findMany({
    where: { userId: user.id },
    orderBy: { takenAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="section-title text-2xl">体の記録</h1>
        <p className="mt-1 text-sm text-muted">
          変化を見たい人だけでOK。ここに載せた写真は<span className="font-bold text-ink">あなたにしか見えません</span>。無理はしないでね。
        </p>
      </div>

      <div className="card">
        <BodyUpload />
      </div>

      {photos.length > 0 && (
        <div className="card">
          <p className="section-title mb-3 text-base">これまでの記録（{photos.length}）</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {photos.map((p) => (
              <div key={p.id} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/api/uploads/${p.thumbPath}`} alt={p.note ?? "体の記録"} className="h-full w-full object-cover" />
                <span className="absolute left-1 top-1 rounded-full bg-ink/70 px-1.5 py-0.5 text-[10px] text-white">{dateToKey(p.takenAt)}</span>
                <form action={deleteBody.bind(null, p.id)} className="absolute right-1 top-1 opacity-0 transition group-hover:opacity-100">
                  <button className="rounded-full bg-white/85 px-2 py-0.5 text-[10px] font-bold text-accent">削除</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
