import { Product } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";

export class GetAllProductsUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(): Promise<Product[]> {
        return this.productRepository.findAll();
    }
}
