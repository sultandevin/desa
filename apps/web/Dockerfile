FROM oven/bun:1.3.2

WORKDIR /app

# Copy root package.json and lockfile
COPY package.json bun.lock* ./

# Copy all package.json files
COPY apps/web/package.json ./apps/web/package.json
COPY packages/api/package.json ./packages/api/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/auth/package.json ./packages/auth/package.json

RUN bun install --no-save --frozen-lockfile

# Copy app source
COPY . .

RUN bun turbo build

CMD ["bun", "./apps/web/server.js"]
