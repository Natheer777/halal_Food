import { Router } from "express";
import { getContainer } from "@infrastructure/di/container";
import { ProductController } from "@presentation/controllers/ProductController";
import {
    createProductValidation,
    updateProductValidation,
    productIdValidation
} from "@presentation/validators/productValidators";
import { handleValidationResult } from "@presentation/validators/validationResultHandler";

export function createProductRouter(): Router {
    const router = Router();
    const container = getContainer();

    const productController = new ProductController(
        container.createProductUseCase,
        container.updateProductUseCase,
        container.deleteProductUseCase,
        container.getProductUseCase,
        container.getAllProductsUseCase,
        container.getVisibleProductsUseCase
    );

    router.post(
        "/products",
        createProductValidation,
        handleValidationResult,
        productController.createProduct
    );

    router.get(
        "/products",
        productController.getAllProducts
    );

    router.get(
        "/products/visible",
        productController.getVisibleProducts
    );

    router.get(
        "/products/:id",
        productIdValidation,
        handleValidationResult,
        productController.getProduct
    );

    router.put(
        "/products/:id",
        updateProductValidation,
        handleValidationResult,
        productController.updateProduct
    );

    router.delete(
        "/products/:id",
        productIdValidation,
        handleValidationResult,
        productController.deleteProduct
    );

    return router;
}
