import { Request, Response, NextFunction } from "express";
import { CreateMainCategoryUseCase } from "@application/use-cases/main-category/CreateMainCategoryUseCase";
import { GetMainCategoriesWithSubcategoriesUseCase } from "@application/use-cases/main-category/GetMainCategoriesWithSubcategoriesUseCase";
import { UpdateMainCategoryUseCase, MainCategoryNotFoundError } from "@application/use-cases/main-category/UpdateMainCategoryUseCase";
import { DeleteMainCategoryUseCase } from "@application/use-cases/main-category/DeleteMainCategoryUseCase";
import { UploadFile } from "@application/services/IFileStorageService";

export class MainCategoryController {
  constructor(
    private readonly createMainCategoryUseCase: CreateMainCategoryUseCase,
    private readonly getMainCategoriesWithSubcategoriesUseCase: GetMainCategoriesWithSubcategoriesUseCase,
    private readonly updateMainCategoryUseCase: UpdateMainCategoryUseCase,
    private readonly deleteMainCategoryUseCase: DeleteMainCategoryUseCase
  ) { }

  createMainCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const file = req.file;
      if (!file) {

        throw new Error("Image file is required.");
      }

      const uploadFile: UploadFile = {
        buffer: file.buffer,
        mimeType: file.mimetype,
        originalName: file.originalname
      };

      const result = await this.createMainCategoryUseCase.execute({
        name: req.body.name,
        image: uploadFile
      });

      res.status(201).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  getMainCategoriesWithSubcategories = async (
    _req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const result = await this.getMainCategoriesWithSubcategoriesUseCase.execute();
      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      next(error);
    }
  };

  updateMainCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      const file = req.file;

      const image: UploadFile | null = file
        ? {
          buffer: file.buffer,
          mimeType: file.mimetype,
          originalName: file.originalname
        }
        : null;

      const result = await this.updateMainCategoryUseCase.execute({
        id,
        name: req.body.name,
        image
      });

      res.status(200).json({ status: "success", data: result });
    } catch (error) {
      if (error instanceof MainCategoryNotFoundError) {
        res.status(404).json({ status: "failed", message: error.message });
        return;
      }

      next(error);
    }
  };

  deleteMainCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const idParam = req.params.id;
      const id = Array.isArray(idParam) ? idParam[0] : idParam;
      await this.deleteMainCategoryUseCase.execute(id);
      res.status(204).send();
    } catch (error) {
      if (error instanceof MainCategoryNotFoundError) {
        res.status(404).json({ status: "failed", message: error.message });
        return;
      }

      next(error);
    }
  };
}

