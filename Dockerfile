FROM oven/bun:1 AS base

WORKDIR /app

# Copy package.json and bun.lock for efficient caching
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy all project files
COPY . .

# Start the application
CMD ["bun", "run", "start"]
