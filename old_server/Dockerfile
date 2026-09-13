FROM denoland/deno:latest

WORKDIR /app

# Cache dependencies
COPY deno.json deno.lock ./
RUN deno install

# Copy source
COPY . .

EXPOSE 4900

CMD ["deno", "task", "dev"]
