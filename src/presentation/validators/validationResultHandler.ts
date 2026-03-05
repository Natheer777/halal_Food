import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

export function handleValidationResult(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    next();
    return;
  }

  const errorArray = errors.array();
  const uniqueErrors = errorArray.reduce((acc: any[], error: any) => {
    const existingError = acc.find(e => e.path === error.path);
    if (!existingError) {
      acc.push(error);
    }
    return acc;
  }, []);

  res.status(400).json({
    status: "failed",
    message: "Validation failed.",
    errors: uniqueErrors
  });
}

