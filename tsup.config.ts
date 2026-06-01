import { defineConfig } from "tsup";

/**
 * 本番用: standalone Hono サーバー（src/server/index.ts）を dist/ にバンドルする。
 * Docker の runtime ステージで `node dist/index.js` として起動する。
 */
export default defineConfig({
  entry: ["src/server/index.ts"],
  outDir: "dist",
  format: ["esm"],
  target: "node22",
  clean: true,
  // 依存はバンドルに同梱（runtime で node_modules を持たなくてよい）
  noExternal: [/.*/],
});
