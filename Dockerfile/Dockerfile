# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Kopírování build výstupu do nginx
COPY --from=build /app/build /usr/share/nginx/html

# Kopírování vlastní nginx konfigurace (volitelné)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Spuštění nginx
CMD ["nginx", "-g", "daemon off;"]
