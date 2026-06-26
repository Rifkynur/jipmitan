# Jimpitan Backend

Backend API untuk aplikasi Jimpitan Desa Pesu.

## 🚀 Quick Start

### 1. Start PostgreSQL (Docker)

```bash
docker-compose up -d
```

### 2. Setup & Run Backend

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Atau gunakan script setup:

```bash
./setup.sh
```

## 📦 Prerequisites

- Docker & Docker Compose
- Node.js
- npm

## 🔧 Environment Variables

Copy `.env.example` ke `.env`:

```bash
cp .env.example .env
```

Konfigurasi di `.env`:

```env
DATABASE_URL=postgresql://jimpitan_user:jimpitan_pass@localhost:5432/jimpitan_db
JWT_SECRET=jwt_secret
JWT_EXPIRES_IN=4d
PORT=5000
```

## 🗄️ Database

### Start/Stop PostgreSQL

```bash
# Start
docker-compose up -d

# Stop
docker-compose down

# View logs
docker-compose logs -f postgres
```

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Open Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset
```

## 📡 API Endpoints

- `POST /api/auth/login` - Login
- `GET /api/auth/checkAuth` - Check authentication
- `POST /api/auth/loguot` - Logout
- `GET /api/income` - Get all income
- `POST /api/income` - Create income
- `PATCH /api/income/:id` - Update income
- `DELETE /api/income/:id` - Delete income
- `GET /api/expense` - Get all expense
- `POST /api/expense` - Create expense
- `GET /api/members` - Get all members
- `POST /api/members` - Create member

## 🛠️ Tech Stack

- Node.js + Express
- Prisma ORM
- PostgreSQL
- JWT Authentication
