import { Request, Response, NextFunction } from "express";
import {
  CreateSubcategoryUseCase,
  MainCategoryNotFoundError
} from "@application/use-cases/subcategory/CreateSubcategoryUseCase";
import {
  UpdateSubcategoryUseCase,
  SubcategoryNotFoundError
} from "@application/use-cases/subcategory/UpdateSubcategoryUseCase";
import { DeleteSubcategoryUseCase } from "@application/use-cases/subcategory/DeleteSubcategoryUseCase";
import { GetSubcategoriesUseCase } from "@application/use-cases/subcategory/GetSubcategoriesUseCase";

export class SubcategoryController {
  constructor(
    private readonly createSubcategoryUseCase: CreateSubcategoryUseCase,
    private readonly updateSubcategoryUseCase: UpdateSubcategoryUseCase,
    private readonly deleteSubcategoryUseCase: DeleteSubcategoryUseCase,
    private readonly getSubcategoriesUseCase: GetSubcategoriesUseCase
  ) { }

  createSubcategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mainCategoryIdParam = req.params.mainCategoryId;
      const mainCategoryId = Array.isArray(mainCategoryIdParam)
        ? mainCategoryIdParam[0]
        : mainCategoryIdParam;
      const { name } = req.body;

      const result = await this.createSubcategoryUseCase.execute({
        mainCategoryId,
        name
      });

      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      if (error instanceof MainCategoryNotFoundError) {
        res.status(404).json({ status: "failed", message: error.message });
        return;
      }

      next(error);
    }
  };

  updateSubcategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const mainCategoryIdParam = req.params.mainCategoryId;
      const subcategoryIdParam = req.params.subcategoryId;
      const mainCategoryId = Array.isArray(mainCategoryIdParam)
        ? mainCategoryIdParam[0]
        : mainCategoryIdParam;
      const subcategoryId = Array.isArray(subcategoryIdParam)
        ? subcategoryIdParam[0]
        : subcategoryIdParam;
      const { name } = req.body;

      const result = await this.updateSubcategoryUseCase.execute({
        id: subcategoryId,
        mainCategoryId,
        name
      });

      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      if (error instanceof MainCategoryNotFoundError || error instanceof SubcategoryNotFoundError) {
        res.status(404).json({ status: "failed", message: error.message });
        return;
      }

      next(error);
    }
  };

  deleteSubcategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const subcategoryIdParam = req.params.subcategoryId;
      const subcategoryId = Array.isArray(subcategoryIdParam)
        ? subcategoryIdParam[0]
        : subcategoryIdParam;

      await this.deleteSubcategoryUseCase.execute(subcategoryId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof SubcategoryNotFoundError) {
        res.status(404).json({ status: "failed", message: error.message });
        return;
      }

      next(error);
    }
  };

  getSubcategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string || "1", 10);
      const limit = parseInt(req.query.limit as string || "10", 10);

      const result = await this.getSubcategoriesUseCase.execute({ page, limit });
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };
}

