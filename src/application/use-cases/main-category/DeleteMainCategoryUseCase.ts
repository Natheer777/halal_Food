import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { MainCategoryNotFoundError } from "@application/use-cases/main-category/UpdateMainCategoryUseCase";

export class DeleteMainCategoryUseCase {
  constructor(private readonly mainCategoryRepository: IMainCategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.mainCategoryRepository.findById(id);
    if (!existing) {
      throw new MainCategoryNotFoundError(id);
    }

    await this.mainCategoryRepository.delete(id);
  }
}

