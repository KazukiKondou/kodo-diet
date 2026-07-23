import type { Metadata, Viewport } from "next"
import "./globals.css"

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Cocoa"

export const metadata: Metadata = {
  title: {
    default: `${appName} — 毎日をあたたかく記録する`,
    template: `%s ・ ${appName}`,
  },
  description: "運動・体重・食事をゆるく続ける、ブラウンなダイエット記録。ジムのノリじゃなく、自分を大事にする記録を。",
  applicationName: appName,
}

export const viewport: Viewport = {
  themeColor: "#faf5ee",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  )
}
