import { Hono } from "hono";
import { cors } from "hono/cors";

/**
 * 共有 Hono アプリ（単一の真実）
 *
 * - ローカル開発: Next.js の Route Handler から `handle(app)` で呼ばれる
 *   (src/app/api/[[...route]]/route.ts)
 * - 本番/別環境: @hono/node-server の standalone サーバーから呼ばれる
 *   (src/server/index.ts)
 *
 * どちらの起動方法でもエンドポイントは `/api/*` に揃うよう basePath を設定する。
 */
// `.use(...).get(...).get(...)` をチェーンして型を積み上げ、その型を AppType として export する。
// 別オリジン（本番でフロントと API サーバーが別ホスト）からの呼び出しに備えて CORS を有効化。
// 許可オリジンは CORS_ORIGIN で指定（既定は全許可。ハンズオン用途）。
const app = new Hono()
  .basePath("/api")
  .use(
    "*",
    cors({
      origin: process.env.CORS_ORIGIN ?? "*",
    }),
  )
  .get("/hello", (c) => {
    // どのサーバーが応答したか分かるように runtime 情報を含める（ハンズオン用）。
    const servedBy = process.env.HONO_SERVER_NAME ?? "next-mounted";
    return c.json({
      message: "Hello from Hono!",
      servedBy,
      time: new Date().toISOString(),
    });
  })
  .get("/users/:id", (c) => {
    const id = c.req.param("id");
    return c.json({
      id,
      name: `User ${id}`,
    });
  });

export type AppType = typeof app;

export default app;
