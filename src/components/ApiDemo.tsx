"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/api-client";

type HelloResponse = {
  message: string;
  servedBy: string;
  time: string;
};

/**
 * ブラウザから Hono RPC クライアント経由で /api/hello を呼ぶデモ。
 * クライアント側で実行することで、別オリジンの standalone サーバーへ
 * 接続を切り替えた場合（CORS 含む）の動作も確認できる。
 */
export function ApiDemo() {
  const [data, setData] = useState<HelloResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    client.api.hello
      .$get()
      .then((res) => res.json())
      .then(setData)
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div style={{ fontFamily: "monospace", lineHeight: 1.8 }}>
      <p>
        接続先 (NEXT_PUBLIC_API_URL):{" "}
        <strong>{process.env.NEXT_PUBLIC_API_URL || "(同一オリジン)"}</strong>
      </p>
      {error && <pre style={{ color: "crimson" }}>Error: {error}</pre>}
      {data ? (
        <pre
          style={{
            background: "#f4f4f5",
            padding: "1rem",
            borderRadius: 8,
            color: "#18181b",
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
      ) : (
        !error && <p>Loading...</p>
      )}
    </div>
  );
}
