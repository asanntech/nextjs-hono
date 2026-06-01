# 本番の「別サーバー」: standalone Hono API サーバー専用のランタイムイメージ。
#
# tsup が全依存を dist/index.mjs に同梱（noExternal）するため、ランタイムは
# node_modules 不要。事前に `pnpm build:server` で dist/ を生成しておくこと。
# （ビルドとランタイムを分離することで、dev ツールを含まない最小イメージになる）
FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY dist ./dist

ENV PORT=8787
ENV HONO_SERVER_NAME=standalone-docker
EXPOSE 8787

CMD ["node", "dist/index.mjs"]
