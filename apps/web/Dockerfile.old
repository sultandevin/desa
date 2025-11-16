FROM oven/bun:1-debian AS base
# Set working directory
WORKDIR /app
 
# ---
FROM base AS prepare
# Replace <your-major-version> with the major version installed in your repository. For example:
# RUN bun global add turbo@^2
RUN bun install -g turbo@^2.5.4
COPY . .
# Add lockfile and package.json's of isolated subworkspace
# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "web" is the name entered in the project's package.json: { name: "web" }
RUN turbo prune web --docker
 
# ---
FROM base AS builder
# First install the dependencies (as they change less often)
COPY --from=prepare /app/out/json/ .
RUN bun install --frozen-lockfile
# Build the project
COPY --from=prepare /app/out/full/ .
 
# Uncomment and use build args to enable remote caching
# ARG TURBO_TEAM
# ENV TURBO_TEAM=$TURBO_TEAM
 
# ARG TURBO_TOKEN
# ENV TURBO_TOKEN=$TURBO_TOKEN
 
RUN bun turbo build
 
# ---
FROM base AS runner
# Don't run production as root for security reasons
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs
 
# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/public ./apps/web/public
 
CMD ["bun", "apps/web/server.js"]
