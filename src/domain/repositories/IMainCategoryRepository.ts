import { MainCategory } from "@domain/entities/MainCategory";

export interface IMainCategoryRepository {
  create(mainCategory: MainCategory): Promise<MainCategory>;
  findById(id: string): Promise<MainCategory | null>;
  findAll(): Promise<MainCategory[]>;
  update(mainCategory: MainCategory): Promise<MainCategory>;
  delete(id: string): Promise<void>;
}

