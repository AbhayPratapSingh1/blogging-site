# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/build ./build

EXPOSE 4901

CMD ["serve", "-s", "build", "-l", "4901"]
