import { getPgPool } from "@infrastructure/database/pgClient";
import { PgMainCategoryRepository } from "@infrastructure/repositories/PgMainCategoryRepository";
import { PgSubcategoryRepository } from "@infrastructure/repositories/PgSubcategoryRepository";
import { PgProductRepository } from "@infrastructure/repositories/PgProductRepository";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IProductRepository } from "@domain/repositories/IProductRepository";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";
import { PgOfferRepository } from "@infrastructure/repositories/PgOfferRepository";

export interface RegisteredRepositories {
  mainCategoryRepository: IMainCategoryRepository;
  subcategoryRepository: ISubcategoryRepository;
  productRepository: IProductRepository;
  offerRepository: IOfferRepository;
}

export function registerRepositories(): RegisteredRepositories {
  const pool = getPgPool();

  const mainCategoryRepository = new PgMainCategoryRepository(pool);
  const subcategoryRepository = new PgSubcategoryRepository(pool);
  const productRepository = new PgProductRepository(pool);

  return {
    mainCategoryRepository,
    subcategoryRepository,
    productRepository,
    offerRepository: new PgOfferRepository(pool)
  };
}

