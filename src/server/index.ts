import { serve } from "@hono/node-server";
import app from "./app";

/**
 * 本番/別環境用: 共有 Hono アプリを独立した Node サーバーとして起動する。
 * Next.js とは別プロセス（別サーバー / Docker コンテナ）で動かす想定。
 */
const port = Number(process.env.PORT ?? 8787);

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`🔥 Hono server running at http://localhost:${info.port}`);
});
