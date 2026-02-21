import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { createCategoryRouter } from "@presentation/routes/categoryRoutes";

export function createApp(): Application {
  const app = express();
  app.use(express.json());

  const swaggerDocument = YAML.load(
    path.resolve(__dirname, "docs", "swagger.yaml")
  );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api", createCategoryRouter());

  // Basic health endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  // Global error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res.status(500).json({ message: "Internal server error." });
  });

  return app;
}

