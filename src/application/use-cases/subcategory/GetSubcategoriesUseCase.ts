import { Subcategory } from "@domain/entities/Subcategory";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";

export interface GetSubcategoriesRequest {
    page: number;
    limit: number;
}

export interface GetSubcategoriesResponse {
    subcategories: Subcategory[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GetSubcategoriesUseCase {
    constructor(private readonly subcategoryRepository: ISubcategoryRepository) { }

    async execute(request: GetSubcategoriesRequest): Promise<GetSubcategoriesResponse> {
        const { page, limit } = request;
        const { subcategories, total } = await this.subcategoryRepository.findWithPagination(page, limit);

        return {
            subcategories,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}
