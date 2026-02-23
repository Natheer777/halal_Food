import { getPgPool } from "@infrastructure/database/pgClient";
import { PgMainCategoryRepository } from "@infrastructure/repositories/PgMainCategoryRepository";
import { PgSubcategoryRepository } from "@infrastructure/repositories/PgSubcategoryRepository";
import { PgProductRepository } from "@infrastructure/repositories/PgProductRepository";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IProductRepository } from "@domain/repositories/IProductRepository";

export interface RegisteredRepositories {
  mainCategoryRepository: IMainCategoryRepository;
  subcategoryRepository: ISubcategoryRepository;
  productRepository: IProductRepository;
}

export function registerRepositories(): RegisteredRepositories {
  const pool = getPgPool();

  const mainCategoryRepository = new PgMainCategoryRepository(pool);
  const subcategoryRepository = new PgSubcategoryRepository(pool);
  const productRepository = new PgProductRepository(pool);

  return {
    mainCategoryRepository,
    subcategoryRepository,
    productRepository
  };
}

