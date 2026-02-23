import { Router } from "express";
import multer from "multer";
import { getContainer } from "@infrastructure/di/container";
import { MainCategoryController } from "@presentation/controllers/MainCategoryController";
import { SubcategoryController } from "@presentation/controllers/SubcategoryController";
import {
  createMainCategoryValidation,
  updateMainCategoryValidation
} from "@presentation/validators/mainCategoryValidators";
import {
  createSubcategoryValidation,
  updateSubcategoryValidation
} from "@presentation/validators/subcategoryValidators";
import { handleValidationResult } from "@presentation/validators/validationResultHandler";

const upload = multer({ storage: multer.memoryStorage() });

export function createCategoryRouter(): Router {
  const router = Router();
  const container = getContainer();

  const mainCategoryController = new MainCategoryController(
    container.createMainCategoryUseCase,
    container.getMainCategoriesWithSubcategoriesUseCase,
    container.updateMainCategoryUseCase,
    container.deleteMainCategoryUseCase
  );

  const subcategoryController = new SubcategoryController(
    container.createSubcategoryUseCase,
    container.updateSubcategoryUseCase,
    container.deleteSubcategoryUseCase,
    container.getSubcategoriesUseCase
  );

  router.post(
    "/main-categories",
    upload.single("image"),
    createMainCategoryValidation,
    handleValidationResult,
    mainCategoryController.createMainCategory
  );

  router.get(
    "/main-categories",
    mainCategoryController.getMainCategoriesWithSubcategories
  );

  router.put(
    "/main-categories/:id",
    upload.single("image"),
    updateMainCategoryValidation,
    handleValidationResult,
    mainCategoryController.updateMainCategory
  );

  router.delete(
    "/main-categories/:id",
    mainCategoryController.deleteMainCategory
  );

  router.post(
    "/main-categories/:mainCategoryId/subcategories",
    createSubcategoryValidation,
    handleValidationResult,
    subcategoryController.createSubcategory
  );

  router.put(
    "/main-categories/:mainCategoryId/subcategories/:subcategoryId",
    updateSubcategoryValidation,
    handleValidationResult,
    subcategoryController.updateSubcategory
  );

  router.delete(
    "/subcategories/:subcategoryId",
    subcategoryController.deleteSubcategory
  );

  router.get(
    "/subcategories",
    subcategoryController.getSubcategories
  );

  return router;
}

