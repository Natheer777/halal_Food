import { MainCategory } from "@domain/entities/MainCategory";
import { Subcategory } from "@domain/entities/Subcategory";
import { IMainCategoryRepository } from "@domain/repositories/IMainCategoryRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";

export interface MainCategoryWithSubcategories {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  subcategories: Array<{
    id: string;
    name: string;
    createdAt: Date;
  }>;
}

export interface GetMainCategoriesWithSubcategoriesResponse {
  categories: MainCategoryWithSubcategories[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class GetMainCategoriesWithSubcategoriesUseCase {
  constructor(
    private readonly mainCategoryRepository: IMainCategoryRepository,
    private readonly subcategoryRepository: ISubcategoryRepository
  ) { }

  async execute(page: number, limit: number): Promise<GetMainCategoriesWithSubcategoriesResponse> {
    const { categories: mainCategories, total } = await this.mainCategoryRepository.findWithPagination(page, limit);

    if (mainCategories.length === 0) {
      return {
        categories: [],
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      };
    }

    const subcategories: Subcategory[] = await this.subcategoryRepository.findByMainCategoryIds(
      mainCategories.map((c) => c.id)
    );

    const subcategoriesByMainCategory: Record<string, Subcategory[]> = {};
    for (const sub of subcategories) {
      if (!subcategoriesByMainCategory[sub.mainCategoryId]) {
        subcategoriesByMainCategory[sub.mainCategoryId] = [];
      }
      subcategoriesByMainCategory[sub.mainCategoryId].push(sub);
    }

    const results = mainCategories.map((category) => ({
      id: category.id,
      name: category.name,
      imageUrl: category.imageUrl,
      createdAt: category.createdAt,
      subcategories: (subcategoriesByMainCategory[category.id] ?? []).map((sub) => ({
        id: sub.id,
        name: sub.name,
        createdAt: sub.createdAt
      }))
    }));

    return {
      categories: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }
}

