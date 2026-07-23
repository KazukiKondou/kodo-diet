// 動画リンク解析と累積回数集計。ネットワークに触れない純粋部分をテストする。

/** YouTube 動画ID を抽出（watch/youtu.be/shorts/embed 対応）。非対応は null */
export function youtubeId(url: string): string | null {
  try {
    const u = new URL(url)
    const host = u.hostname.replace(/^www\./, "")
    if (host === "youtu.be") return u.pathname.slice(1) || null
    if (host === "youtube.com" || host.endsWith(".youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v")
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null
    }
    return null
  } catch {
    return null
  }
}

export function isYoutube(url: string): boolean {
  return youtubeId(url) !== null
}

/** サムネイルURL（YouTube以外は null） */
export function youtubeThumbnail(url: string): string | null {
  const id = youtubeId(url)
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null
}

/** oEmbed(APIキー不要)でタイトル取得するためのURL */
export function youtubeOembedUrl(url: string): string {
  return `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
}

/** videoId 別の累積実施回数（純粋集計） */
export function countByVideo(logs: { videoId: string | null }[]): Record<string, number> {
  const out: Record<string, number> = {}
  for (const l of logs) {
    if (!l.videoId) continue
    out[l.videoId] = (out[l.videoId] ?? 0) + 1
  }
  return out
}
