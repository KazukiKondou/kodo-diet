"use client"

import { useActionState, useState } from "react"
import { updateProfile, type SettingsState } from "./actions"
import { HEATMAP_PALETTES } from "@/lib/heatmap"

const EMOJIS = ["🍫","🍓","🥑","🍵","🐻","🌰","🍞","🧋","🐿️","🍪","☕","🍯","🥐","🌻","🐨","🍰","🥜","🍩","🫐","🐹","🍎","🥗","🔥","⭐"]

export interface SettingsUser {
  name: string
  email: string
  iconType: "EMOJI" | "PHOTO"
  iconEmoji: string
  image: string | null
  heatmapColor: string
  goalWeightKg: number | null
  declaration: string | null
}

export function SettingsForm({ user }: { user: SettingsUser }) {
  const [state, action, pending] = useActionState<SettingsState, FormData>(updateProfile, null)
  const [iconType, setIconType] = useState(user.iconType)
  const [emoji, setEmoji] = useState(user.iconEmoji)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [palette, setPalette] = useState(user.heatmapColor)

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="iconType" value={iconType} />
      <input type="hidden" name="iconEmoji" value={emoji} />
      <input type="hidden" name="heatmapColor" value={palette} />

      <section className="card">
        <p className="section-title text-base">プロフィール</p>
        <div className="mt-3">
          <label className="label" htmlFor="name">ユーザー名</label>
          <input id="name" name="name" defaultValue={user.name} maxLength={30} required className="input" />
        </div>
        <div className="mt-3">
          <label className="label">メールアドレス</label>
          <input value={user.email} disabled className="input opacity-70" />
          <p className="mt-1 text-xs text-muted">ログインに使います（変更不可）。</p>
        </div>
      </section>

      <section className="card">
        <p className="section-title text-base">アイコン</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => setIconType("EMOJI")} className={iconType === "EMOJI" ? "btn-primary" : "btn-outline"}>絵文字</button>
          <button type="button" onClick={() => setIconType("PHOTO")} className={iconType === "PHOTO" ? "btn-primary" : "btn-outline"}>写真</button>
        </div>

        {iconType === "EMOJI" ? (
          <div className="mt-4 grid grid-cols-8 gap-2">
            {EMOJIS.map((e) => (
              <button
                type="button"
                key={e}
                onClick={() => setEmoji(e)}
                className={`flex aspect-square items-center justify-center rounded-2xl text-xl transition ${emoji === e ? "bg-primary-soft ring-2 ring-primary" : "bg-sand hover:bg-primary-soft/60"}`}
              >
                {e}
              </button>
            ))}
          </div>
        ) : (
          <label className="mt-4 block cursor-pointer">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-dashed border-line bg-cream">
              {photoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={photoPreview} alt="" className="h-full w-full object-cover" />
              ) : user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-xs text-muted">写真を選ぶ</span>
              )}
            </div>
            <input
              name="photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                setPhotoPreview(f ? URL.createObjectURL(f) : null)
              }}
            />
          </label>
        )}
      </section>

      <section className="card">
        <p className="section-title text-base">ヒートマップの色</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.values(HEATMAP_PALETTES).map((p) => (
            <button
              type="button"
              key={p.key}
              onClick={() => setPalette(p.key)}
              className={`rounded-2xl border p-2 transition ${palette === p.key ? "border-primary ring-2 ring-primary-soft" : "border-line"}`}
            >
              <div className="flex gap-1">
                {p.colors.map((c, i) => (
                  <span key={i} className="h-4 w-4 rounded-[4px]" style={{ backgroundColor: c }} />
                ))}
              </div>
              <p className="mt-1 text-xs font-semibold text-ink">{p.label}</p>
            </button>
          ))}
        </div>
      </section>

      <section className="card">
        <p className="section-title text-base">目標</p>
        <div className="mt-3">
          <label className="label" htmlFor="goal">目標体重 (kg)</label>
          <input id="goal" name="goalWeightKg" type="number" step="0.1" min="20" max="400" defaultValue={user.goalWeightKg ?? ""} className="input" />
        </div>
        <div className="mt-3">
          <label className="label" htmlFor="decl">目標の宣言</label>
          <textarea id="decl" name="declaration" maxLength={140} rows={2} defaultValue={user.declaration ?? ""} className="input resize-none" />
        </div>
      </section>

      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      {state?.ok && <p className="text-sm font-semibold text-matcha">保存しました ✓</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5">
        {pending ? "保存中…" : "設定を保存"}
      </button>
    </form>
  )
}
