import { IProductRepository } from "@domain/repositories/IProductRepository";

export class DeleteProductUseCase {
    constructor(private readonly productRepository: IProductRepository) { }

    async execute(id: string): Promise<void> {
        const existingProduct = await this.productRepository.findById(id);
        if (!existingProduct) {
            throw new Error(`Product with ID ${id} not found.`);
        }

        await this.productRepository.delete(id);
    }
}
