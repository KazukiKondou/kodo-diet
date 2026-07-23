import nodemailer from "nodemailer"
import fs from "node:fs/promises"
import path from "node:path"

// 開発時に発行したマジックリンクを保存する場所（画面表示・E2E用）。
const DEV_STORE = path.join(process.cwd(), ".dev-magic-links.json")

/** 本番メール送信が設定済みか（未設定なら開発フォールバック） */
export function emailConfigured(): boolean {
  return Boolean(process.env.EMAIL_SERVER)
}

function renderHtml(url: string): string {
  return `
  <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px;color:#3b2a1a">
    <h2 style="color:#6f4318">Cocoa へのログイン</h2>
    <p>下のボタンからログインできます（15分間有効）。心当たりがなければ無視してください。</p>
    <p style="text-align:center;margin:28px 0">
      <a href="${url}" style="background:#a9713a;color:#fff;padding:12px 28px;border-radius:999px;text-decoration:none;font-weight:bold">ログインする</a>
    </p>
    <p style="font-size:12px;color:#8a7a68;word-break:break-all">${url}</p>
  </div>`
}

/** マジックリンクを送信。未設定時はログ＋ファイルに保存して即動作させる。 */
export async function sendMagicLink(to: string, url: string): Promise<void> {
  if (emailConfigured()) {
    const transport = nodemailer.createTransport(process.env.EMAIL_SERVER as string)
    await transport.sendMail({
      to,
      from: process.env.EMAIL_FROM ?? "Cocoa <no-reply@localhost>",
      subject: "Cocoa へのログイン",
      text: `以下のリンクからログインしてください（15分間有効）\n${url}`,
      html: renderHtml(url),
    })
    return
  }
  // 開発フォールバック
  console.log(`\n===== [DEV] ログインリンク (${to}) =====\n${url}\n=====================================\n`)
  let store: Record<string, string> = {}
  try {
    store = JSON.parse(await fs.readFile(DEV_STORE, "utf8"))
  } catch {
    store = {}
  }
  store[to.toLowerCase()] = url
  await fs.writeFile(DEV_STORE, JSON.stringify(store), "utf8")
}

/** 開発モードで最後に発行したリンクを取得 */
export async function readDevMagicLink(to: string): Promise<string | null> {
  try {
    const store = JSON.parse(await fs.readFile(DEV_STORE, "utf8"))
    return store[to.toLowerCase()] ?? null
  } catch {
    return null
  }
}
