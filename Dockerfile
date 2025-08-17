# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files first to leverage caching
COPY package*.json ./

# Test file alteration for commit
# Install dependencies
RUN npm install --silent

# Copy source code after dependencies are installed
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Install wget for health check
RUN apk add --no-cache wget

# Copy built app to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
 CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]