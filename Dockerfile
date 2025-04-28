FROM oven/bun:1 AS base

WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy package.json and bun.lock for efficient caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy all project files
COPY . .

# Start the application
CMD ["bun", "run", "start"]
