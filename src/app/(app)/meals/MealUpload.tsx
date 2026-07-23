"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { uploadMeal, type MealState } from "./actions"

export function MealUpload() {
  const [state, action, pending] = useActionState<MealState, FormData>(uploadMeal, null)
  const [preview, setPreview] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset()
      setPreview(null)
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-3">
      <label className="block cursor-pointer">
        <span className="label">食事の写真</span>
        <div className="flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-cream">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="プレビュー" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-muted">タップして写真を選ぶ 📷</span>
          )}
        </div>
        <input
          name="photo"
          type="file"
          accept="image/*"
          capture="environment"
          required
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            setPreview(f ? URL.createObjectURL(f) : null)
          }}
        />
      </label>

      <input name="caption" type="text" maxLength={140} placeholder="ひとこと（任意）" className="input" />

      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
        <input type="checkbox" name="share" className="h-4 w-4 accent-[var(--color-primary)]" />
        みんなの共有フィードにも出す（5時間だけ表示）
      </label>

      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "アップロード中…" : "記録する"}
      </button>
    </form>
  )
}
