FROM node:22-bookworm-slim

# fontconfig is required at runtime: the server registers bundled brand
# fonts (Space Grotesk / JetBrains Mono / Inter) via fc-cache so sharp's
# SVG rasterizer can find them by family name. Without this package,
# generated graphics silently fall back to a generic system font.
RUN apt-get update \
  && apt-get install -y --no-install-recommends fontconfig \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY server/package.json server/package-lock.json server/
RUN cd server && npm ci --omit=dev

COPY client/package.json client/package-lock.json client/
RUN cd client && npm ci

COPY . .
RUN cd client && npm run build

ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "server/index.js"]
