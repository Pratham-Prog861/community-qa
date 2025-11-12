# Development Dockerfile for backend
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy source code
COPY backend/ .

EXPOSE 5000

CMD ["npm", "run", "dev"]
