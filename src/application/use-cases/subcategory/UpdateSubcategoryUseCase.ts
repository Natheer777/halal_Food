import { Subcategory } from "@domain/entities/Subcategory";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { MainCategoryNotFoundError } from "@application/use-cases/main-category/UpdateMainCategoryUseCase";

export interface UpdateSubcategoryRequest {
  id: string;
  mainCategoryId: string;
  name: string;
}

export interface UpdateSubcategoryResponse {
  id: string;
  mainCategoryId: string;
  name: string;
  createdAt: Date;
}

export class SubcategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Subcategory with id '${id}' was not found.`);
    this.name = "SubcategoryNotFoundError";
  }
}

export class UpdateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly mainCategoryRepository: IMainCategoryRepository
  ) {}

  async execute(request: UpdateSubcategoryRequest): Promise<UpdateSubcategoryResponse> {
    const [existing, mainCategory] = await Promise.all([
      this.subcategoryRepository.findById(request.id),
      this.mainCategoryRepository.findById(request.mainCategoryId)
    ]);

    if (!existing) {
      throw new SubcategoryNotFoundError(request.id);
    }

    if (!mainCategory) {
      throw new MainCategoryNotFoundError(request.mainCategoryId);
    }

    const updated: Subcategory = {
      ...existing,
      mainCategoryId: request.mainCategoryId,
      name: request.name.trim()
    };

    const saved = await this.subcategoryRepository.update(updated);

    return {
      id: saved.id,
      mainCategoryId: saved.mainCategoryId,
      name: saved.name,
      createdAt: saved.createdAt
    };
  }
}

