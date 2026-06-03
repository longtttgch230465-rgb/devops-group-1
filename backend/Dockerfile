FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .


FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production

# Sửa lại: copy đúng file thực tế
COPY --from=builder /app/server.js ./

EXPOSE 8080

# Sửa lại: chạy đúng entry point
CMD ["node", "server.js"]