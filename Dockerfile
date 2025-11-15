FROM oven/bun:1-alpine AS base
WORKDIR /usr/src/app

# Install Dependencies 
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Rebuild source code only when needed
FROM base AS builder
WORKDIR /usr/src/app
COPY --from=install /usr/src/app/node_modules ./node_modules
COPY . .

# Build
RUN bun run build

FROM base AS runner
WORKDIR /usr/src/app

ENV NODE_ENV=production \
    PORT=3001 \
    HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /usr/src/app/public ./public
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /usr/src/app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["bun", "./server.js"]
