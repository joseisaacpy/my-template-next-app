# syntax=docker/dockerfile:1
#
# Imagens do app (veja docs/docker.md). Targets:
#   migrate — roda `prisma migrate deploy` e sai
#   runner  — o app Next.js (standalone), imagem final
#
# NEXT_PUBLIC_BASE_URL é embutida no bundle no BUILD: para mudar a URL do
# site é preciso reconstruir a imagem (--build-arg NEXT_PUBLIC_BASE_URL=...).

ARG NODE_VERSION=24

# ── base: Node + pnpm (versão fixada em `packageManager`) ─────────────────────
FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app

# ── deps: dependências + client Prisma gerado ─────────────────────────────────
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# `--ignore-scripts` evita o `prepare` (lefthook, precisa de .git); o client
# Prisma é gerado logo abaixo.
RUN pnpm install --frozen-lockfile --ignore-scripts
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm exec prisma generate

# ── migrate: aplica as migrações e termina ────────────────────────────────────
FROM deps AS migrate
CMD ["pnpm", "exec", "prisma", "migrate", "deploy"]

# ── builder: build do Next em modo standalone ─────────────────────────────────
FROM deps AS builder
COPY . .
ARG NEXT_PUBLIC_BASE_URL=http://localhost:3000
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_OUTPUT=standalone \
    SKIP_ENV_VALIDATION=1 \
    NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ── runner: imagem final, sem pnpm nem dependências de desenvolvimento ────────
FROM node:${NODE_VERSION}-alpine AS runner
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
# A validação de env (env.ts) roda aqui, em runtime: faltou variável, não sobe.
CMD ["node", "server.js"]
