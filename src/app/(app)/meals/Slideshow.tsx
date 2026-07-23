"use client"

import { useEffect, useState } from "react"

export interface SlideItem {
  full: string
  caption: string | null
  date: string
}

export function Slideshow({ items }: { items: SlideItem[] }) {
  const [open, setOpen] = useState(false)
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!open || !playing || items.length === 0) return
    const t = setInterval(() => setI((v) => (v + 1) % items.length), 2500)
    return () => clearInterval(t)
  }, [open, playing, items.length])

  if (items.length === 0) return null

  return (
    <>
      <button className="btn-outline w-full" onClick={() => { setOpen(true); setI(0); setPlaying(true) }}>
        ▶ スライドショーで振り返る（{items.length}枚）
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-ink/90 p-4" onClick={() => setOpen(false)}>
          <div className="flex justify-end">
            <button className="rounded-full bg-white/20 px-3 py-1 text-sm text-white" onClick={() => setOpen(false)}>
              閉じる ✕
            </button>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={items[i].full} alt="" className="max-h-[70vh] max-w-full rounded-2xl object-contain" />
            <p className="mt-3 text-center text-sm text-white/90">
              {items[i].caption ? `${items[i].caption}・` : ""}
              {items[i].date}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button className="rounded-full bg-white/20 px-4 py-2 text-white" onClick={() => setI((v) => (v - 1 + items.length) % items.length)}>‹</button>
              <button className="rounded-full bg-white/20 px-4 py-2 text-sm text-white" onClick={() => setPlaying((p) => !p)}>
                {playing ? "⏸" : "▶"}
              </button>
              <button className="rounded-full bg-white/20 px-4 py-2 text-white" onClick={() => setI((v) => (v + 1) % items.length)}>›</button>
            </div>
            <p className="mt-2 text-xs text-white/60">{i + 1} / {items.length}</p>
          </div>
        </div>
      )}
    </>
  )
}
