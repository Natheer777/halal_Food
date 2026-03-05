import { Product, ProductStatus } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IFileStorageService, UploadFile } from "@application/services/IFileStorageService";

export interface UpdateProductRequest {
    id: string;
    name: string;
    subcategoryName: string;
    manufacturingLocation: string;
    availableQuantity: number;
    price: number;
    size: string;
    description?: string;
    status: ProductStatus;
    images?: UploadFile[];
}

export class UpdateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly subcategoryRepository: ISubcategoryRepository,
        private readonly fileStorageService: IFileStorageService
    ) { }

    async execute(request: UpdateProductRequest): Promise<Product> {
        const existingProduct = await this.productRepository.findById(request.id);
        if (!existingProduct) {
            throw new Error(`Product with ID ${request.id} not found.`);
        }

        const subcategory = await this.subcategoryRepository.findByName(request.subcategoryName);
        if (!subcategory) {
            throw new Error(`Subcategory with name "${request.subcategoryName}" not found.`);
        }

        let imageUrls = existingProduct.images;
        if (request.images && request.images.length > 0) {
            imageUrls = await this.fileStorageService.uploadProductImages(request.images);
        }

        const { subcategoryName, ...rest } = existingProduct;
        const updatedProduct: Omit<Product, 'subcategoryName'> = {
            ...rest,
            name: request.name,
            manufacturingLocation: request.manufacturingLocation,
            availableQuantity: request.availableQuantity,
            price: request.price,
            size: request.size,
            description: request.description,
            status: request.status,
            images: imageUrls
        };

        return this.productRepository.update(updatedProduct, subcategory.id);
    }
}
