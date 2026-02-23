import { CreateMainCategoryUseCase } from "@application/use-cases/main-category/CreateMainCategoryUseCase";
import { GetMainCategoriesWithSubcategoriesUseCase } from "@application/use-cases/main-category/GetMainCategoriesWithSubcategoriesUseCase";
import { UpdateMainCategoryUseCase, MainCategoryNotFoundError } from "@application/use-cases/main-category/UpdateMainCategoryUseCase";
import { DeleteMainCategoryUseCase } from "@application/use-cases/main-category/DeleteMainCategoryUseCase";
import { CreateSubcategoryUseCase } from "@application/use-cases/subcategory/CreateSubcategoryUseCase";
import { UpdateSubcategoryUseCase, SubcategoryNotFoundError } from "@application/use-cases/subcategory/UpdateSubcategoryUseCase";
import { DeleteSubcategoryUseCase } from "@application/use-cases/subcategory/DeleteSubcategoryUseCase";
import { GetSubcategoriesUseCase } from "@application/use-cases/subcategory/GetSubcategoriesUseCase";
import { CreateProductUseCase } from "@application/use-cases/product/CreateProductUseCase";
import { UpdateProductUseCase } from "@application/use-cases/product/UpdateProductUseCase";
import { DeleteProductUseCase } from "@application/use-cases/product/DeleteProductUseCase";
import { GetProductUseCase } from "@application/use-cases/product/GetProductUseCase";
import { GetAllProductsUseCase } from "@application/use-cases/product/GetAllProductsUseCase";
import { GetVisibleProductsUseCase } from "@application/use-cases/product/GetVisibleProductsUseCase";
import { RegisteredRepositories } from "@infrastructure/di/registerRepositories";
import { RegisteredServices } from "@infrastructure/di/registerServices";

export interface RegisteredUseCases {
  createMainCategoryUseCase: CreateMainCategoryUseCase;
  getMainCategoriesWithSubcategoriesUseCase: GetMainCategoriesWithSubcategoriesUseCase;
  createSubcategoryUseCase: CreateSubcategoryUseCase;
  updateMainCategoryUseCase: UpdateMainCategoryUseCase;
  deleteMainCategoryUseCase: DeleteMainCategoryUseCase;
  updateSubcategoryUseCase: UpdateSubcategoryUseCase;
  deleteSubcategoryUseCase: DeleteSubcategoryUseCase;
  getSubcategoriesUseCase: GetSubcategoriesUseCase;
  createProductUseCase: CreateProductUseCase;
  updateProductUseCase: UpdateProductUseCase;
  deleteProductUseCase: DeleteProductUseCase;
  getProductUseCase: GetProductUseCase;
  getAllProductsUseCase: GetAllProductsUseCase;
  getVisibleProductsUseCase: GetVisibleProductsUseCase;
}

export function registerUseCases(
  deps: RegisteredRepositories & RegisteredServices
): RegisteredUseCases {
  const createMainCategoryUseCase = new CreateMainCategoryUseCase(
    deps.mainCategoryRepository,
    deps.fileStorageService
  );

  const getMainCategoriesWithSubcategoriesUseCase =
    new GetMainCategoriesWithSubcategoriesUseCase(
      deps.mainCategoryRepository,
      deps.subcategoryRepository
    );

  const createSubcategoryUseCase = new CreateSubcategoryUseCase(
    deps.subcategoryRepository,
    deps.mainCategoryRepository
  );

  const updateMainCategoryUseCase = new UpdateMainCategoryUseCase(
    deps.mainCategoryRepository,
    deps.fileStorageService
  );

  const deleteMainCategoryUseCase = new DeleteMainCategoryUseCase(
    deps.mainCategoryRepository
  );

  const updateSubcategoryUseCase = new UpdateSubcategoryUseCase(
    deps.subcategoryRepository,
    deps.mainCategoryRepository
  );

  const deleteSubcategoryUseCase = new DeleteSubcategoryUseCase(
    deps.subcategoryRepository
  );

  const getSubcategoriesUseCase = new GetSubcategoriesUseCase(
    deps.subcategoryRepository
  );

  const createProductUseCase = new CreateProductUseCase(
    deps.productRepository,
    deps.subcategoryRepository
  );

  const updateProductUseCase = new UpdateProductUseCase(
    deps.productRepository,
    deps.subcategoryRepository
  );

  const deleteProductUseCase = new DeleteProductUseCase(
    deps.productRepository
  );

  const getProductUseCase = new GetProductUseCase(
    deps.productRepository
  );

  const getAllProductsUseCase = new GetAllProductsUseCase(
    deps.productRepository
  );

  const getVisibleProductsUseCase = new GetVisibleProductsUseCase(
    deps.productRepository
  );

  return {
    createMainCategoryUseCase,
    getMainCategoriesWithSubcategoriesUseCase,
    createSubcategoryUseCase,
    updateMainCategoryUseCase,
    deleteMainCategoryUseCase,
    updateSubcategoryUseCase,
    deleteSubcategoryUseCase,
    getSubcategoriesUseCase,
    createProductUseCase,
    updateProductUseCase,
    deleteProductUseCase,
    getProductUseCase,
    getAllProductsUseCase,
    getVisibleProductsUseCase
  };
}

