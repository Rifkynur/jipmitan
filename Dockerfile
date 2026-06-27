# ==========================================
# Stage 1: Build & Generate Prisma
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# (Opsional: Tetap pasang build-base jika kamu belum migrasi ke bcryptjs)
# RUN apk add --no-cache build-base python3

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

COPY . .

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

# Tambahkan --ignore-scripts agar tidak memicu 'prisma generate' di stage ini
RUN npm ci --omit=dev --ignore-scripts

# Salin folder prisma duluan agar perintah migrasi di CMD nanti bisa jalan
COPY --from=builder /app/prisma ./prisma

# Ambil hasil generate Prisma Client dari stage builder
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app ./

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]