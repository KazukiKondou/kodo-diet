"use client"

import { useActionState } from "react"
import { saveOnboarding, type OnboardingState } from "./actions"

export function OnboardingForm() {
  const [state, action, pending] = useActionState<OnboardingState, FormData>(saveOnboarding, null)

  return (
    <form action={action} className="mt-6 space-y-5">
      <div>
        <label className="label" htmlFor="birthDate">生年月日</label>
        <input id="birthDate" name="birthDate" type="date" required className="input" />
        <p className="mt-1 text-xs text-muted">年齢の計算に使います（あとから変わりません）。</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label" htmlFor="heightCm">身長 (cm)</label>
          <input id="heightCm" name="heightCm" type="number" step="0.1" min="80" max="260" required placeholder="170" className="input" />
        </div>
        <div>
          <label className="label" htmlFor="sex">性別</label>
          <select id="sex" name="sex" required defaultValue="" className="input">
            <option value="" disabled>選択</option>
            <option value="MALE">男性</option>
            <option value="FEMALE">女性</option>
            <option value="OTHER">その他</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-line p-4">
        <p className="text-sm font-bold text-ink">目標（あとで変えられます）</p>
        <div className="mt-3">
          <label className="label" htmlFor="goalWeightKg">目標体重 (kg)</label>
          <input id="goalWeightKg" name="goalWeightKg" type="number" step="0.1" min="20" max="400" placeholder="60" className="input" />
        </div>
        <div className="mt-3">
          <label className="label" htmlFor="declaration">目標の宣言</label>
          <textarea id="declaration" name="declaration" maxLength={140} rows={2} placeholder="夏までにあと3kg。健康的にいこう🍫" className="input resize-none" />
        </div>
      </div>

      {state?.error && <p className="text-sm font-semibold text-accent">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full py-3.5 text-base">
        {pending ? "保存中…" : "はじめる"}
      </button>
    </form>
  )
}
