import { CreateMainCategoryUseCase } from "@application/use-cases/main-category/CreateMainCategoryUseCase";
import { GetMainCategoriesWithSubcategoriesUseCase } from "@application/use-cases/main-category/GetMainCategoriesWithSubcategoriesUseCase";
import { UpdateMainCategoryUseCase, MainCategoryNotFoundError } from "@application/use-cases/main-category/UpdateMainCategoryUseCase";
import { DeleteMainCategoryUseCase } from "@application/use-cases/main-category/DeleteMainCategoryUseCase";
import { CreateSubcategoryUseCase } from "@application/use-cases/subcategory/CreateSubcategoryUseCase";
import { UpdateSubcategoryUseCase, SubcategoryNotFoundError } from "@application/use-cases/subcategory/UpdateSubcategoryUseCase";
import { DeleteSubcategoryUseCase } from "@application/use-cases/subcategory/DeleteSubcategoryUseCase";
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

  return {
    createMainCategoryUseCase,
    getMainCategoriesWithSubcategoriesUseCase,
    createSubcategoryUseCase,
    updateMainCategoryUseCase,
    deleteMainCategoryUseCase,
    updateSubcategoryUseCase,
    deleteSubcategoryUseCase
  };
}

