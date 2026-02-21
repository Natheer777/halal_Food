import { body, param } from "express-validator";

export const createSubcategoryValidation = [
  param("mainCategoryId").isUUID().withMessage("mainCategoryId must be a valid UUID."),
  body("name").isString().trim().notEmpty().withMessage("Name is required.")
];

export const updateSubcategoryValidation = [
  param("mainCategoryId").isUUID().withMessage("mainCategoryId must be a valid UUID."),
  param("subcategoryId").isUUID().withMessage("subcategoryId must be a valid UUID."),
  body("name").isString().trim().notEmpty().withMessage("Name is required.")
];
