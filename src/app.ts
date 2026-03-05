import express, { Application, NextFunction, Request, Response } from "express";
import path from "path";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import { createCategoryRouter } from "@presentation/routes/categoryRoutes";
import { createProductRouter } from "@presentation/routes/productRoutes";
import { createOfferRouter } from "@presentation/routes/offerRoutes";

export function createApp(): Application {
  const app = express();
  app.use(express.json());

  const swaggerDocument = YAML.load(
    path.resolve(__dirname, "docs", "swagger.yaml")
  );

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api", createCategoryRouter());
  app.use("/api", createProductRouter());
  app.use("/api", createOfferRouter());

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "success", message: "Server is healthy" });
  });

  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).json({ status: "failed", message: "Internal server error." });
  });

  return app;
}
