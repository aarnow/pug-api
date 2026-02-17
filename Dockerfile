# ---- Build stage ----
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first (layer cache optimisation)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# ---- Runtime ----
EXPOSE 3000

CMD ["node", "bin/www.js"]