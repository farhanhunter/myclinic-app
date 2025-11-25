FROM node:20-alpine

# Install netcat for healthcheck
RUN apk add --no-cache netcat-openbsd

WORKDIR /app

# Copy package files dan prisma folder
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

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