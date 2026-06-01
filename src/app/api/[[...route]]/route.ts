/**
 * ローカル開発用: 共有 Hono アプリを Next.js サーバー内にマウントする。
 * catch-all `[[...route]]` + Hono 側の basePath("/api") で `/api/*` を Hono が処理。
 * これにより `next dev` だけで API も一緒に起動でき、別プロセスは不要。
 *
 * 本番（next build / Vercel 等、NODE_ENV=production）ではマウントを無効化し、
 * `/api/*` は 404 を返す。本番の API は別サーバー（Docker, src/server/index.ts）が担う。
 * API ロジックを本番 Next バンドルに含めないよう dynamic import を使う。
 */
export const runtime = "nodejs";

async function handler(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not Found", { status: 404 });
  }
  const { handle } = await import("hono/vercel");
  const { default: app } = await import("@/server/app");
  return handle(app)(req);
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
export const OPTIONS = handler;
