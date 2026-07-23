import { youtubeOembedUrl, isYoutube } from "./video"

/** YouTube oEmbed から動画タイトルを取得（APIキー不要）。失敗時は null。 */
export async function fetchVideoTitle(url: string): Promise<string | null> {
  if (!isYoutube(url)) return null
  try {
    const res = await fetch(youtubeOembedUrl(url), { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return null
    const data = (await res.json()) as { title?: unknown }
    return typeof data.title === "string" ? data.title : null
  } catch {
    return null
  }
}
