import "reflect-metadata";
import dotenv from "dotenv";
import path from "path";
import http from "http";
import { createApp } from "./app";

function loadEnvironment(): void {
  const nodeEnv = process.env.NODE_ENV ?? "development";

  const envFile =
    nodeEnv === "development"
      ? ".env.development"
      : nodeEnv === "production"
      ? ".env.production"
      : `.env.${nodeEnv}`;

  dotenv.config({
    path: path.resolve(__dirname, "..", envFile)
  });
}

async function bootstrap(): Promise<void> {
  loadEnvironment();

  const app = createApp();
  const port = process.env.PORT ? Number(process.env.PORT) : 3000;

  const server = http.createServer(app);

  server.listen(port, () => {

    console.log(`Server is running on port ${port}`);
  });
}

bootstrap().catch((error) => {

  console.error("Failed to start server:", error);
  process.exit(1);
});

