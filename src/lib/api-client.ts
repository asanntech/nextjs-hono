import { hc } from "hono/client";
import type { AppType } from "@/server/app";

/**
 * 型安全な API クライアント（Hono RPC）。
 * AppType を共有することで、エンドポイントのパス・レスポンス型が補完される。
 *
 * 接続先は NEXT_PUBLIC_API_URL で切替:
 * - ローカル開発: 空 = 同一オリジン（Next.js にマウントした /api/* を叩く）
 * - 本番:         別サーバーの URL（例: https://api.example.com）
 */
const baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

export const client = hc<AppType>(baseUrl);
