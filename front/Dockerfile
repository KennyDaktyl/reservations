# Etap 1: Budowanie aplikacji
FROM node:21-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etap 2: Minimalny obraz produkcyjny
FROM node:21-alpine
WORKDIR /app
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/
COPY --from=builder /app/.next /app/.next
RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile
ENV NODE_ENV=production
EXPOSE 3050
CMD ["pnpm", "start"]
