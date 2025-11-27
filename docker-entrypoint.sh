#!/bin/sh
set -e

echo "🚀 Starting application..."

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL..."
until nc -z postgres 5432; do
  echo "Waiting for PostgreSQL to be ready..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Run migrations
echo "🔄 Running migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run clinic data seed
if [ -f "prisma/seed.ts" ]; then
  echo "🌱 Running clinic data seed from prisma/seed.ts..."
  npx tsx prisma/seed.ts
elif [ -f "prisma/seed.js" ]; then
  echo "🌱 Running clinic data seed from prisma/seed.js..."
  node prisma/seed.js
else
  echo "⚠️  No clinic seed file found, skipping..."
fi

# Run accounts seed
if [ -f "prisma/seed-accounts.ts" ]; then
  echo "🔐 Running accounts seed from prisma/seed-accounts.ts..."
  npx tsx prisma/seed-accounts.ts
elif [ -f "prisma/seed-accounts. js" ]; then
  echo "🔐 Running accounts seed from prisma/seed-accounts. js..."
  node prisma/seed-accounts.js
else
  echo "⚠️  No accounts seed file found, skipping..."
fi

# Start Next. js
echo "🎯 Starting Next.js..."
exec npm run dev