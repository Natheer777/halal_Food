import { Subcategory } from "@domain/entities/Subcategory";

export interface ISubcategoryRepository {
  create(subcategory: Subcategory): Promise<Subcategory>;
  findByMainCategoryIds(mainCategoryIds: string[]): Promise<Subcategory[]>;
  update(subcategory: Subcategory): Promise<Subcategory>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Subcategory | null>;
  findByName(name: string): Promise<Subcategory | null>;
  findWithPagination(page: number, limit: number): Promise<{ subcategories: Subcategory[], total: number }>;
}

