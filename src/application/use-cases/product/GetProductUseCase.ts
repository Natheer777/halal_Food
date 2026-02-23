import { Product } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";

export class GetProductUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string): Promise<Product | null> {
        return this.productRepository.findById(id);
    }
}
