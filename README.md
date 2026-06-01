# Next.js App Router + Hono ハンズオン

Hono アプリを **1 箇所で定義** し、起動方法だけを切り替える構成です。

- **ローカル開発**: Hono を Next.js サーバー内にマウント（`next dev` だけで完結）
- **本番 / 別環境**: 同じ Hono アプリを独立した Node サーバー（Docker）として起動

## 構成

```
ブラウザ ──(hc client)──▶ NEXT_PUBLIC_API_URL + /api/*
                              │
        ┌─────────────────────┴─────────────────────┐
   ローカル開発                                    本番
   base = '' (同一オリジン)                    base = 'https://api.example.com'
   src/app/api/[[...route]]/route.ts           src/server/index.ts
   = handle(app)  ← Next.js が /api/* を処理     = @hono/node-server ← Docker
        └──────────── 同じ src/server/app.ts を import ────────────┘
```

| ファイル | 役割 |
| --- | --- |
| `src/server/app.ts` | 共有 Hono アプリ（ルート定義・`AppType` を export）。`basePath("/api")`。 |
| `src/app/api/[[...route]]/route.ts` | ローカル用。`handle(app)` で Next.js にマウント。 |
| `src/server/index.ts` | 本番用。`@hono/node-server` で standalone 起動。 |
| `src/lib/api-client.ts` | 型安全 RPC クライアント（`hc<AppType>`）。 |
| `src/components/ApiDemo.tsx` | ブラウザから API を叩くデモ。 |

エンドポイントは両方の起動方法で `/api/*` に揃えてあります（`basePath` による単一の真実）。

## セットアップ

```bash
pnpm install
cp .env.example .env.local   # 既に .env.local がある場合は不要
```

## ローカル開発（Next.js に同梱）

```bash
pnpm dev
```

- http://localhost:3000 — デモページが API レスポンスを表示
- `curl http://localhost:3000/api/hello` — JSON を返す

`.env.local` の `NEXT_PUBLIC_API_URL` は空（同一オリジン）。

> Next.js 内の `/api/*` マウントは **`next dev`（開発時）のみ有効**です。本番ビルド
> （`next build` / Vercel 等）では `/api/*` は 404 になり、API は別サーバー（Docker）が
> 担います。フロントは `NEXT_PUBLIC_API_URL` でその別サーバーを向くようにしてください。

## 別サーバー（standalone）をローカルで試す

```bash
pnpm dev:server   # tsx watch で src/server/index.ts を起動（:8787）
curl http://localhost:8787/api/hello
```

フロントの接続先を standalone に切り替えるには `.env.local` で:

```
NEXT_PUBLIC_API_URL=http://localhost:8787
```

を設定して `pnpm dev` を再起動（CORS が効いて別オリジン経由で取得できる）。

## 本番ビルド / Docker（別サーバー）

```bash
pnpm build:server          # tsup で dist/ にバンドル
pnpm start:server          # node dist/index.js で起動

# または Docker（先に build:server で dist/ を生成しておく）
pnpm build:server
docker compose up --build  # http://localhost:8787/api/hello
```

> この Docker イメージは **Hono API サーバー専用** です。Next.js フロント本体は
> 別途（Vercel 等）にデプロイし、その環境変数で `NEXT_PUBLIC_API_URL` に
> この API サーバーの URL を設定してください。
