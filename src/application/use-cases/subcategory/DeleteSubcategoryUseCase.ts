import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { SubcategoryNotFoundError } from "@application/use-cases/subcategory/UpdateSubcategoryUseCase";

export class DeleteSubcategoryUseCase {
  constructor(private readonly subcategoryRepository: ISubcategoryRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.subcategoryRepository.findById(id);
    if (!existing) {
      throw new SubcategoryNotFoundError(id);
    }

    await this.subcategoryRepository.delete(id);
  }
}

