import { Request, Response, NextFunction } from "express";
import { CreateProductUseCase } from "@application/use-cases/product/CreateProductUseCase";
import { UpdateProductUseCase } from "@application/use-cases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "@application/use-cases/product/DeleteProductUseCase";
import { GetProductUseCase } from "@application/use-cases/product/GetProductUseCase";
import { GetAllProductsUseCase } from "@application/use-cases/product/GetAllProductsUseCase";
import { GetVisibleProductsUseCase } from "@application/use-cases/product/GetVisibleProductsUseCase";
import { UploadFile } from "@application/services/IFileStorageService";

export class ProductController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly deleteProductUseCase: DeleteProductUseCase,
        private readonly getProductUseCase: GetProductUseCase,
        private readonly getAllProductsUseCase: GetAllProductsUseCase,
        private readonly getVisibleProductsUseCase: GetVisibleProductsUseCase
    ) { }

    createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const files = req.files as Express.Multer.File[];
            
            const images: UploadFile[] = files ? files.map(file => ({
                buffer: file.buffer,
                mimeType: file.mimetype,
                originalName: file.originalname
            })) : [];

            const result = await this.createProductUseCase.execute({
                ...req.body,
                images
            });
            res.status(201).json({ status: "success", data: result });
        } catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ status: "failed", message: error.message });
                return;
            }
            next(error);
        }
    };

    updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id: idParam } = req.params;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;
            const files = req.files as Express.Multer.File[];
            
            const images: UploadFile[] | undefined = files && files.length > 0 
                ? files.map(file => ({
                    buffer: file.buffer,
                    mimeType: file.mimetype,
                    originalName: file.originalname
                }))
                : undefined;

            const result = await this.updateProductUseCase.execute({ 
                ...req.body, 
                id,
                images
            });
            res.status(200).json({ status: "success", data: result });
        } catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ status: "failed", message: error.message });
                return;
            }
            next(error);
        }
    };

    deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id: idParam } = req.params;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;
            await this.deleteProductUseCase.execute(id);
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error && error.message.includes("not found")) {
                res.status(404).json({ status: "failed", message: error.message });
                return;
            }
            next(error);
        }
    };

    getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id: idParam } = req.params;
            const id = Array.isArray(idParam) ? idParam[0] : idParam;
            const result = await this.getProductUseCase.execute(id);
            if (!result) {
                res.status(404).json({ status: "failed", message: "Product not found." });
                return;
            }
            res.status(200).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    };

    getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getAllProductsUseCase.execute();
            res.status(200).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    };

    getVisibleProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string || "1", 10);
            const limit = parseInt(req.query.limit as string || "10", 10);
            const result = await this.getVisibleProductsUseCase.execute({ page, limit });
            res.status(200).json({ status: "success", data: result });
        } catch (error) {
            next(error);
        }
    };
}
