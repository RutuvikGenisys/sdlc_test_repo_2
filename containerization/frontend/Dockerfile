# Multi-stage Dockerfile for React Frontend

# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app/frontend

# Copy package.json and package-lock.json first to leverage Docker cache
COPY frontend/package*.json ./

RUN npm install --silent

# Copy the rest of the application code
COPY frontend/ ./

# Build the React app for production
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
# You might need to create an `nginx.conf` file in `containerization/frontend/nginx.conf`
# to properly serve your React app (e.g., for routing fallbacks)
COPY containerization/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy the build output from the build stage into Nginx's public directory
COPY --from=build /app/frontend/build /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
