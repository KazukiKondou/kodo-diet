# kodo-diet 開発ステータス

ブラウン系・Gen-Z のダイエット記録サイト（Next.js 16 / React 19 / Prisma 6 / Postgres / Auth.js マジックリンク / Tailwind v4）。
ブランド名は Cocoa（`NEXT_PUBLIC_APP_NAME`）。デプロイ先 = kondo-home-server、ドメイン = kodokazuki.kazukikondo.com、port 3015、GitHub public。

## 稼働環境
- ローカルDB: docker `kodo-diet-db-dev`（postgres:16, host 5433）
- dev: `npm run dev`（port 3015）。preview name = `kodo-diet`（.claude/launch.json は Personal 直下）
- npm cache: `$scratchpad/npmcache` を使う（グローバル ~/.npm は権限破損）

## 完了
- Prisma schema + init migration + seed（種目カタログ25件）
- 純粋ロジック + Vitest 27件緑（calc/heatmap/feed/video/dates）
- 認証（マジックリンク・パスワードレス。dev はリンク画面表示/`.dev-magic-links.json`、prod は EMAIL_SERVER）
- ランディング / login / verify / onboarding / (app)レイアウト+Nav / dashboard(スタブ) / uploads配信 / logout
- デザインシステム globals.css（茶系トークン、btn/card/input等）

## TODO（残実装）
- dashboard 本実装（宣言バナー・体重/BMIカード・ヒートマップ・クイックアクション）
- /workouts（種目プルダウン＋メトリクス別入力＋動画リンク＋累積回数＋ヒートマップ）
- /weight（毎日入力＋推移＋BMI/標準体重/目標差）
- /meals（写真アップロード＋今週ギャラリー＋週次スライドショー＋共有トグル）
- /feed（全ユーザー直近5時間・Google Photos風・自分の投稿削除）
- /body（任意・所有者限定・成果可視化）
- /settings（ユーザー名/メール/アイコン絵文字or写真/ヒートマップ配色）
- Heatmap 表示コンポーネント（src/components）
- 追加のユニットテスト、E2E（Claude in Chrome）、秘密情報スキャン
- Docker化 + docker-compose + deploy.sh(cron) + cloudflare tunnel + DNS + GitHub public push

## 注意
- GateGuard フックが Write/Edit/Bash で事実提示を要求（各操作に importers/affected/schema/verbatim を付す運用）
- Prisma は7系NG（url廃止）→6系採用
