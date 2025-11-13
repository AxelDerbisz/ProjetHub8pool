# ----- Étape 1: Build (Compilation TS) -----
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build # (Suppose que vous avez un script "build": "tsc" dans package.json)

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY package*.json ./
RUN npm install --only=production

CMD ["node", "dist/index.js"]