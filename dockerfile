FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Copy all files
COPY . .

EXPOSE 3000

# Development mode
CMD ["npm", "run", "dev"]