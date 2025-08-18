# Build stage
FROM node:18-alpine AS build

WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Install dependencies
RUN npm install --silent

# Copy all source code, including src/, public/, etc.
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install wget for health check (can be combined with other RUN commands)
RUN apk add --no-cache wget

# Copy built app from the 'build' stage to nginx's serving directory
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]