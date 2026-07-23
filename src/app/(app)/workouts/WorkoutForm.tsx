"use client"

import { useActionState, useEffect, useMemo, useRef, useState } from "react"
import { addWorkoutLog, type WorkoutState } from "./actions"
import type { Metric } from "@/lib/exercises"

export interface ExerciseOption {
  id: string
  name: string
  category: string
  metric: Metric
}

export function WorkoutForm({ exercises, todayKey }: { exercises: ExerciseOption[]; todayKey: string }) {
  const [state, action, pending] = useActionState<WorkoutState, FormData>(addWorkoutLog, null)
  const [selectedId, setSelectedId] = useState(exercises[0]?.id ?? "")
  const [useVideo, setUseVideo] = useState(false)
  const [saved, setSaved] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const grouped = useMemo(() => {
    const map = new Map<string, ExerciseOption[]>()
    for (const e of exercises) {
      if (!map.has(e.category)) map.set(e.category, [])
      map.get(e.category)!.push(e)
    }
    return [...map.entries()]
  }, [exercises])

  const metric = exercises.find((e) => e.id === selectedId)?.metric ?? "REPS"

  useEffect(() => {
    if (state?.ok) {
      setSaved(true)
      formRef.current?.reset()
      setUseVideo(false)
      const t = setTimeout(() => setSaved(false), 2000)
      return () => clearTimeout(t)
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-4">
      <input type="hidden" name="date" value={todayKey} />
      <div>
        <label className="label" htmlFor="ex">種目</label>
        <select
          id="ex"
          name="exerciseTypeId"
          className="input"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {grouped.map(([cat, items]) => (
            <optgroup key={cat} label={cat}>
              {items.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* メトリクス別入力 */}
      {metric === "REPS" && (
        <Field label="回数">
          <input name="reps" type="number" min="0" step="1" placeholder="10" className="input" />
        </Field>
      )}
      {metric === "WEIGHT_REPS" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="重量 (kg)">
            <input name="weightKg" type="number" min="0" step="0.5" placeholder="40" className="input" />
          </Field>
          <Field label="回数">
            <input name="reps" type="number" min="0" step="1" placeholder="10" className="input" />
          </Field>
        </div>
      )}
      {metric === "TIME" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="時間（分）">
            <input name="durMin" type="number" min="0" step="1" placeholder="5" className="input" />
          </Field>
          <Field label="秒">
            <input name="durSec" type="number" min="0" max="59" step="1" placeholder="30" className="input" />
          </Field>
        </div>
      )}
      {metric === "DISTANCE" && (
        <Field label="距離 (km)">
          <input name="distanceKm" type="number" min="0" step="0.1" placeholder="3.0" className="input" />
        </Field>
      )}

      {/* 動画を見てやった場合 */}
      <div className="rounded-2xl border border-line p-3">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-ink">
          <input
            type="checkbox"
            name="useVideo"
            checked={useVideo}
            onChange={(e) => setUseVideo(e.target.checked)}
            className="h-4 w-4 accent-[var(--color-primary)]"
          />
          動画を見ながらやった
        </label>
        {useVideo && (
          <div className="mt-3 space-y-3">
            <Field label="動画のリンク">
              <input name="videoUrl" type="url" placeholder="https://youtu.be/..." className="input" />
            </Field>
            <Field label="題名（空欄なら動画タイトルを自動取得）">
              <input name="videoTitle" type="text" placeholder="例: 5分腹筋" className="input" />
            </Field>
          </div>
        )}
      </div>

      <Field label="メモ（任意）">
        <input name="note" type="text" maxLength={200} placeholder="今日はキツかった💦" className="input" />
      </Field>

      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      {saved && <p className="text-sm font-semibold text-matcha">記録しました ✓</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? "記録中…" : "記録する"}
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <span className="label">{label}</span>
      {children}
    </div>
  )
}
