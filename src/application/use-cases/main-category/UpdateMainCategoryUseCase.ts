import { MainCategory } from "@domain/entities/MainCategory";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { IFileStorageService, UploadFile } from "@application/services/IFileStorageService";

export interface UpdateMainCategoryRequest {
  id: string;
  name?: string;
  image?: UploadFile | null;
}

export interface UpdateMainCategoryResponse {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

export class MainCategoryNotFoundError extends Error {
  constructor(id: string) {
    super(`Main category with id '${id}' was not found.`);
    this.name = "MainCategoryNotFoundError";
  }
}

export class UpdateMainCategoryUseCase {
  constructor(
    private readonly mainCategoryRepository: IMainCategoryRepository,
    private readonly fileStorageService: IFileStorageService
  ) {}

  async execute(request: UpdateMainCategoryRequest): Promise<UpdateMainCategoryResponse> {
    const existing = await this.mainCategoryRepository.findById(request.id);
    if (!existing) {
      throw new MainCategoryNotFoundError(request.id);
    }

    let imageUrl = existing.imageUrl;
    if (request.image) {
      imageUrl = await this.fileStorageService.uploadCategoryImage(request.image);
    }

    const updated: MainCategory = {
      ...existing,
      name: request.name !== undefined ? request.name.trim() : existing.name,
      imageUrl
    };

    const saved = await this.mainCategoryRepository.update(updated);

    return {
      id: saved.id,
      name: saved.name,
      imageUrl: saved.imageUrl,
      createdAt: saved.createdAt
    };
  }
}

