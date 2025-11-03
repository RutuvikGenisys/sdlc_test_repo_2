# Multi-stage Dockerfile for Node.js Backend

# Stage 1: Build dependencies
FROM node:20-alpine AS build

WORKDIR /app/backend

# Copy package.json and package-lock.json first to leverage Docker cache
COPY backend/package*.json ./ 

RUN npm install --omit=dev --silent

# Stage 2: Production image
FROM node:20-alpine

WORKDIR /app/backend

# Copy installed dependencies from the build stage
COPY --from=build /app/backend/node_modules ./node_modules

# Copy the rest of the application code
COPY backend/ ./

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "index.js"]
