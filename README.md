# Cocoa 🍫 — 毎日をあたたかく記録するダイエット記録アプリ

ジム感ゼロ・ブラウン基調の、ゆるく続けられるダイエット記録サービス。運動・体重・食事を記録し、続けた日をヒートマップで可視化します。

## 主な機能
- **運動記録**: 種目プルダウン（メトリクス別入力）／動画リンク＋累積回数／GitHub風ヒートマップ（配色選択可）
- **体重・目標**: 毎日の体重、BMI・標準体重差・目標差の自動計算、推移グラフ、目標宣言
- **食事記録**: 写真アップロード、週次スライドショー、直近5時間の共有フィード
- **体の記録**: 任意・本人のみ閲覧
- **アカウント**: メールのマジックリンク（パスワードレス）、絵文字/写真アイコン

## 技術構成
Next.js 16 (App Router) / React 19 / TypeScript / Prisma 6 + PostgreSQL / Auth.js (NextAuth v5) / Tailwind CSS v4 / Vitest

## 開発
```bash
cp .env.example .env   # 値を設定（AUTH_SECRET は openssl rand -base64 32）
docker run -d --name kodo-diet-db -e POSTGRES_USER=kodo -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=kodo_diet -p 5433:5432 postgres:16-alpine
npm install
npx prisma migrate dev
npm run seed      # 種目カタログ投入
npm run dev       # http://localhost:3015
npm test          # 単体テスト
```

メール未設定の開発モードでは、ログインリンクが確認画面に表示されます（本番は `EMAIL_SERVER` に SMTP を設定）。
