FROM node:20-slim AS builder

WORKDIR /app

# Build tools required to compile better-sqlite3 native addon
RUN apt-get update \
  && apt-get install -y python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# Drop dev dependencies before copying to final stage
RUN npm prune --omit=dev

# ---- runner ----
FROM node:20-slim

WORKDIR /app

# libstdc++ is needed at runtime by the compiled better-sqlite3 binary
RUN apt-get update \
  && apt-get install -y libstdc++6 \
  && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# These directories are mounted as Railway persistent volumes.
# Creating them here ensures the container starts even before volumes attach.
RUN mkdir -p auth_info_baileys data

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
