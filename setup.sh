#!/bin/bash

echo "🚀 Starting Jimpitan Backend Setup..."

# Step 1: Start PostgreSQL container
echo "📦 Starting PostgreSQL container..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Step 2: Install dependencies
echo "📥 Installing dependencies..."
npm install

# Step 3: Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Step 4: Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Step 5: (Optional) Seed the database
echo "🌱 Seeding database (optional)..."
# node prisma/seed.js

echo "✅ Setup complete!"
echo "📝 To start the backend server, run: npm run dev"
