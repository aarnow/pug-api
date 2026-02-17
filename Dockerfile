# ---- Build stage ----
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies (including devDependencies for sequelize-cli)
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# ---- Runtime ----
EXPOSE 3000

# Lance la migration puis démarre le serveur
CMD ["sh", "-c", "npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all && node bin/www.js"]