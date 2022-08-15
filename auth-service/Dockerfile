FROM node:16-slim AS builder
COPY proto /proto
COPY auth-service /app
WORKDIR /app
RUN npm i --location=global install-local
RUN npm i
RUN npm run proto:install
RUN npm run prebuild && npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
EXPOSE 5000
CMD ["node", "dist/main.js"]
