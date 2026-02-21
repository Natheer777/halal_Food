import { getPgPool } from "@infrastructure/database/pgClient";
import { PgMainCategoryRepository } from "@infrastructure/repositories/PgMainCategoryRepository";
import { PgSubcategoryRepository } from "@infrastructure/repositories/PgSubcategoryRepository";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";

export interface RegisteredRepositories {
  mainCategoryRepository: IMainCategoryRepository;
  subcategoryRepository: ISubcategoryRepository;
}

export function registerRepositories(): RegisteredRepositories {
  const pool = getPgPool();

  const mainCategoryRepository = new PgMainCategoryRepository(pool);
  const subcategoryRepository = new PgSubcategoryRepository(pool);

  return {
    mainCategoryRepository,
    subcategoryRepository
  };
}

