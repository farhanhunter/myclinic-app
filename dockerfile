FROM node:20-alpine

RUN apk add --no-cache \
    openssl \
    openssl-dev \
    netcat-openbsd

WORKDIR /app

# Copy package files dan prisma folder
COPY package*.json ./
COPY prisma ./prisma/

# Configure npm for better network handling
RUN npm config set fetch-retries 5 && \
    npm config set fetch-retry-mintimeout 20000 && \
    npm config set fetch-retry-maxtimeout 120000

# Install dependencies with retry
RUN npm install || npm install || npm install

# Install tsx globally for running TypeScript files
RUN npm install -g tsx

# Generate Prisma Client
RUN npx prisma generate

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Copy all files
COPY . .

EXPOSE 3000

# Use entrypoint script
ENTRYPOINT ["docker-entrypoint.sh"]