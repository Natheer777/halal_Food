import { v4 as uuidv4 } from "uuid";
import { MainCategory } from "@domain/entities/MainCategory";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { IFileStorageService, UploadFile } from "@application/services/IFileStorageService";

export interface CreateMainCategoryRequest {
  name: string;
  image: UploadFile;
}

export interface CreateMainCategoryResponse {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
}

export class CreateMainCategoryUseCase {
  constructor(
    private readonly mainCategoryRepository: IMainCategoryRepository,
    private readonly fileStorageService: IFileStorageService
  ) {}

  async execute(request: CreateMainCategoryRequest): Promise<CreateMainCategoryResponse> {
    const { name, image } = request;

    const imageUrl = await this.fileStorageService.uploadCategoryImage(image);

    const mainCategory: MainCategory = {
      id: uuidv4(),
      name: name.trim(),
      imageUrl,
      createdAt: new Date()
    };

    const created = await this.mainCategoryRepository.create(mainCategory);

    return {
      id: created.id,
      name: created.name,
      imageUrl: created.imageUrl,
      createdAt: created.createdAt
    };
  }
}

