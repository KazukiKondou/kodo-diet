// 食事共有フィードの可視判定（直近N時間）。純粋関数で単体テスト可能にする。

export const FEED_WINDOW_HOURS = 5

/** at が now から hours 時間以内（かつ未来でない）か */
export function isWithinLastHours(at: Date, now: Date, hours: number): boolean {
  const diffMs = now.getTime() - at.getTime()
  return diffMs >= 0 && diffMs <= hours * 3600_000
}

export interface FeedItemLike {
  sharedAt: Date | null
}

/** フィード表示対象か（共有済み かつ 直近N時間） */
export function isVisibleInFeed(item: FeedItemLike, now: Date, hours = FEED_WINDOW_HOURS): boolean {
  return item.sharedAt !== null && isWithinLastHours(item.sharedAt, now, hours)
}

/** 入力配列を変更せず、可視分を新しい順で返す */
export function filterFeed<T extends FeedItemLike>(
  items: T[],
  now: Date,
  hours = FEED_WINDOW_HOURS,
): T[] {
  return items
    .filter((i) => isVisibleInFeed(i, now, hours))
    .sort((a, b) => b.sharedAt!.getTime() - a.sharedAt!.getTime())
}
