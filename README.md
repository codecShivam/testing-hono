# Backend Service

A Bun.js backend service with PostgreSQL database.

## Running with Docker

This project uses Docker Compose to manage the application and database services.

### Environment Variables

Before starting, create a `.env` file at the root of the project with the following variables:

```
# Database Configuration
DATABASE_URL=postgres://postgres:postgres@postgres:5432/postgres-db
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres-db

# Application Configuration
NODE_ENV=development
HOST=0.0.0.0
PORT=3000
API_VERSION=v1
LOGGING_ENABLED=true
```

### Starting the Services

1. Start the PostgreSQL database and application:

```bash
docker-compose up -d
```

2. Run migrations:

```bash
docker-compose run --rm migrations
```

3. One-liner to start everything and run migrations:

```bash
docker-compose up -d && docker-compose run --rm migrations
```

### Stopping the Services

```bash
docker-compose down
```

To remove volumes (which will delete your database data):

```bash
docker-compose down -v
```

## Development

For local development without Docker:

1. Install dependencies: `bun install`
2. Start the PostgreSQL database separately
3. Run the application: `bun run dev`
4. Run migrations: `bun run db:migrate` 