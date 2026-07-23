"use client"

import { useActionState, useEffect, useState } from "react"
import { upsertWeight, type WeightState } from "./actions"

export function WeightForm({ todayKey, defaultWeight }: { todayKey: string; defaultWeight?: number }) {
  const [state, action, pending] = useActionState<WeightState, FormData>(upsertWeight, null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (state?.ok) {
      setSaved(true)
      const t = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [state])

  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <div className="flex-1 min-w-[7rem]">
        <label className="label" htmlFor="w-date">日付</label>
        <input id="w-date" name="date" type="date" defaultValue={todayKey} max={todayKey} required className="input" />
      </div>
      <div className="flex-1 min-w-[7rem]">
        <label className="label" htmlFor="w-kg">体重 (kg)</label>
        <input
          id="w-kg"
          name="weightKg"
          type="number"
          step="0.1"
          min="20"
          max="400"
          defaultValue={defaultWeight ?? ""}
          required
          placeholder="65.0"
          className="input"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary h-[3.25rem] px-6">
        {pending ? "保存中…" : "記録する"}
      </button>
      {state?.error && <p className="w-full text-sm font-semibold text-accent">{state.error}</p>}
      {saved && <p className="w-full text-sm font-semibold text-matcha">保存しました ✓</p>}
    </form>
  )
}
