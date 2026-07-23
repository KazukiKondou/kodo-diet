export interface AvatarUser {
  iconType: "EMOJI" | "PHOTO"
  iconEmoji: string
  image: string | null
  name: string | null
}

// アイコン画像は認証必須の /api/uploads を参照するため、cookie が送られる素の img を使う。
export function Avatar({ user, size = 36 }: { user: AvatarUser; size?: number }) {
  if (user.iconType === "PHOTO" && user.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={user.image}
        alt={user.name ?? "アイコン"}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-primary-soft"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
      aria-hidden
    >
      {user.iconEmoji || "🍫"}
    </span>
  )
}
