"use client"

import { useActionState, useEffect, useRef, useState } from "react"
import { uploadBody, type BodyState } from "./actions"

export function BodyUpload() {
  const [state, action, pending] = useActionState<BodyState, FormData>(uploadBody, null)
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
        <div className="flex aspect-[3/4] max-h-64 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-line bg-cream">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="プレビュー" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm text-muted">タップして写真を選ぶ</span>
          )}
        </div>
        <input
          name="photo"
          type="file"
          accept="image/*"
          required
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            setPreview(f ? URL.createObjectURL(f) : null)
          }}
        />
      </label>
      <input name="note" type="text" maxLength={140} placeholder="メモ（任意・体重や気分など）" className="input" />
      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "保存中…" : "自分だけの記録に保存"}
      </button>
    </form>
  )
}
