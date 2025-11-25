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

# Run seed (support both .js and .ts)
if [ -f "prisma/seed.ts" ]; then
  echo "🌱 Running seed from prisma/seed.ts..."
  npx tsx prisma/seed.ts
elif [ -f "prisma/seed.js" ]; then
  echo "🌱 Running seed from prisma/seed.js..."
  node prisma/seed.js
else
  echo "⚠️  No seed file found, skipping..."
fi

# Start Next.js
echo "🎯 Starting Next.js..."
exec npm run dev