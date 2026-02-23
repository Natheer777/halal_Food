import { Product } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";

export interface GetVisibleProductsRequest {
    page: number;
    limit: number;
}

export interface GetVisibleProductsResponse {
    products: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GetVisibleProductsUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(request: GetVisibleProductsRequest): Promise<GetVisibleProductsResponse> {
        const { page, limit } = request;
        const { products, total } = await this.productRepository.findVisibleWithPagination(page, limit);

        return {
            products,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
}
