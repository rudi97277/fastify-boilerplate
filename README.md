# Fastify DI Boilerplate

Fastify-based backend starter showcasing dependency injection with [awilix](https://github.com/jeffijoe/awilix) + [`@fastify/awilix`](https://github.com/Fastify/fastify-awilix), typed configuration, PostgreSQL access through [Drizzle ORM](https://orm.drizzle.team/), runtime validation via [Zod](https://zod.dev/), and automated API docs using `@fastify/swagger` + Swagger UI.

The structure borrows ideas from community projects such as [`marcoturi/fastify-boilerplate`](https://github.com/marcoturi/fastify-boilerplate) for dependency injection and [`riipandi/fuelstack`](https://github.com/riipandi/fuelstack) for Drizzle/Fastify integration, with adjustments for a focused TypeScript + awilix stack.

## Features

- Fastify server with pino logging and health check endpoint
- Awilix container registered via `@fastify/awilix`, wiring the PostgreSQL pool/Drizzle ORM and feature services
- Automatic DI registration: all files ending in `.controller`, `.service`, or `.repository` under `src/modules/**` are detected and registered as singletons
- Swagger/OpenAPI definitions isolated under `src/docs` to keep route files minimal
- Environment validation (Zod) and `.env.example` for configuration hints
- Tooling: Biome lint/format, Jest unit tests, TypeScript build, Drizzle migrations config

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create an `.env` file** based on `.env.example` and point `DATABASE_URL` to your PostgreSQL instance.
3. **Run database migrations**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```
4. **Start in development mode**
   ```bash
   npm run dev
   ```
   Swagger UI becomes available at `http://localhost:3000/docs` by default.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start Fastify with hot reload via `tsx` |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start` | Run compiled server |
| `npm run lint` / `npm run lint:fix` | Lint (and optionally auto-fix) with Biome |
| `npm run format` | Format source files with Biome |
| `npm run test` | Execute Jest unit tests |
| `npm run db:generate` | Generate Drizzle migration files |
| `npm run db:migrate` | Run pending Drizzle migrations |

## Project Structure

```
src/
  app.ts               # Fastify factory registering swagger, DI, and modules
  app.types.ts         # Shared Fastify instance typing
  config/
    env.ts             # Zod-validated environment loader
    logger.ts          # Pino logger configuration
  container/
    auto-register.ts   # Scans modules and registers awilix components
    index.ts           # Awilix setup (register base dependencies & plugin)
  docs/
    posts.docs.ts      # Swagger/OpenAPI fragments for post routes
  modules/
    index.ts           # Registers feature route modules
    posts/
      post.controller.ts   # Class-based route handlers resolved from awilix
      post.repository.ts    # Data access via Drizzle ORM
      post.routes.ts        # Routes resolved via request-scoped DI
      post.schemas.ts       # Zod validation contracts
      post.service.ts       # Domain logic with logging hooks
  server.ts            # Entry point with graceful shutdown

tests/
  post.service.test.ts # Focused unit tests for PostService
```

## Notes

- `setupDI` registers the awilix container with Fastify and invokes `autoRegisterComponents`, which loads every controller/service/repository file under `src/modules/**` and registers exported classes as singletons. Routes resolve controllers via `request.diScope`. Restart the dev server after adding new controller/service/repository files so the auto-registration scan picks them up.
- Core infrastructure (logger, PostgreSQL pool, Drizzle ORM) is registered once as container values; feature components are singletons in awilix.
- Jest + ts-jest run against the TypeScript sources directly. Use `npm run test` before shipping new logic.
- Biome enforces consistent formatting; adjust rules in `biome.json` if your project needs differ.
- When running Drizzle migrations the first time, ensure the target database already exists.
