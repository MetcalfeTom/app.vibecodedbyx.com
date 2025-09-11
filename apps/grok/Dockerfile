FROM oven/bun:1.1.21
WORKDIR /app

# Install deps
COPY package.json bun.lock* ./
RUN bun install --production

# Copy app source
COPY . .

# The Grok app listens on 3014 (see server.ts)
EXPOSE 3014

CMD ["bun", "run", "server.ts"]

