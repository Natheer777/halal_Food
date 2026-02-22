import dotenv from "dotenv";
import path from "path";
import { getPgPool, closePgPool } from "@infrastructure/database/pgClient";
import { up as up001 } from "@infrastructure/database/migrations/001_create_main_and_subcategories";

function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV ?? "development";

  const envFile =
    nodeEnv === "development"
      ? ".env.development"
      : nodeEnv === "production"
      ? ".env.production"
      : `.env.${nodeEnv}`;

  dotenv.config({
    path: path.resolve(__dirname, "..", "..", "..", envFile)
  });
}

async function runMigrations(): Promise<void> {
  loadEnvironment();

  const pool = getPgPool();

  try {
    await up001(pool);
    console.log("Database migrations executed successfully.");
  } catch (error) {
    console.error("Error running database migrations:", error);
    process.exitCode = 1;
  } finally {
    await closePgPool();
  }
}

runMigrations().catch((error) => {
  console.error("Fatal error running migrations:", error);
  process.exit(1);
});

