# -- Build stage --
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./

# Dependencies
RUN npm install --silent

# Copy all source code
COPY . .

# Build the app
RUN npm run build

# -- Production stage --
FROM nginx:alpine

# wget for Healthcheck
RUN apk add --no-cache wget

# Copy  app from the 'Build stage' to nginx
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]