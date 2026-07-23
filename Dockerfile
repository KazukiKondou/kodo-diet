FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && apt-get clean
WORKDIR /app
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3015
CMD ["sh", "-c", "npx prisma migrate deploy && (npx prisma db seed || true) && npm run start"]
