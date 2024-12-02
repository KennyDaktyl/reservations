FROM node:21-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3050

CMD ["npm", "start"]
