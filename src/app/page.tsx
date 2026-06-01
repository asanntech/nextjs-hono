import { ApiDemo } from "@/components/ApiDemo";

export default function Home() {
  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 1.5rem" }}>
      <h1>Next.js App Router + Hono</h1>
      <p>
        ローカル開発では Hono を Next.js サーバー内にマウントし、本番では同じ
        Hono アプリを別サーバー（Docker）として起動する構成のハンズオンです。
      </p>
      <h2>API Demo</h2>
      <ApiDemo />
    </main>
  );
}
