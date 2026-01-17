FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Copy root package.json and lockfile
COPY package.json bun.lock turbo.json ./

# Copy packages
COPY packages ./packages

# Copy app
COPY apps/server ./apps/server

# Install dependencies
RUN bun install

# Set working directory to server app
WORKDIR /usr/src/app/apps/server

# Expose port
EXPOSE 3000

# Start the server
CMD ["bun", "run", "start"]
