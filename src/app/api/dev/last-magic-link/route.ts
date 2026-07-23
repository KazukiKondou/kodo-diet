import { NextResponse } from "next/server"
import { emailConfigured, readDevMagicLink } from "@/lib/mailer"

// 開発/E2E専用: 本番では無効。
export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production" || emailConfigured()) {
    return NextResponse.json({ error: "disabled" }, { status: 404 })
  }
  const email = new URL(req.url).searchParams.get("email")
  if (!email) return NextResponse.json({ error: "email required" }, { status: 400 })
  const url = await readDevMagicLink(email)
  return NextResponse.json({ url })
}
