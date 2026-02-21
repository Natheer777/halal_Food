import { v4 as uuidv4 } from "uuid";
import { Subcategory } from "@domain/entities/Subcategory";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";

export class MainCategoryNotFoundError extends Error {
  constructor(mainCategoryId: string) {
    super(`Main category with id '${mainCategoryId}' was not found.`);
    this.name = "MainCategoryNotFoundError";
  }
}

export interface CreateSubcategoryRequest {
  mainCategoryId: string;
  name: string;
}

export interface CreateSubcategoryResponse {
  id: string;
  mainCategoryId: string;
  name: string;
  createdAt: Date;
}

export class CreateSubcategoryUseCase {
  constructor(
    private readonly subcategoryRepository: ISubcategoryRepository,
    private readonly mainCategoryRepository: IMainCategoryRepository
  ) {}

  async execute(request: CreateSubcategoryRequest): Promise<CreateSubcategoryResponse> {
    const { mainCategoryId, name } = request;

    const mainCategory = await this.mainCategoryRepository.findById(mainCategoryId);
    if (!mainCategory) {
      throw new MainCategoryNotFoundError(mainCategoryId);
    }

    const subcategory: Subcategory = {
      id: uuidv4(),
      mainCategoryId,
      name: name.trim(),
      createdAt: new Date()
    };

    const created = await this.subcategoryRepository.create(subcategory);

    return {
      id: created.id,
      mainCategoryId: created.mainCategoryId,
      name: created.name,
      createdAt: created.createdAt
    };
  }
}

