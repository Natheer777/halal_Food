import { v4 as uuidv4 } from "uuid";
import { Product, ProductStatus } from "@domain/entities/Product";
import { IProductRepository } from "@domain/repositories/IProductRepository";
import { ISubcategoryRepository } from "@domain/repositories/ISubcategoryRepository";
import { IFileStorageService, UploadFile } from "@application/services/IFileStorageService";

export interface CreateProductRequest {
    name: string;
    subcategoryName: string;
    manufacturingLocation: string;
    availableQuantity: number;
    price: number;
    size: string;
    description?: string;
    status: ProductStatus;
    images: UploadFile[];
}

export class CreateProductUseCase {
    constructor(
        private readonly productRepository: IProductRepository,
        private readonly subcategoryRepository: ISubcategoryRepository,
        private readonly fileStorageService: IFileStorageService
    ) { }

    async execute(request: CreateProductRequest): Promise<Product> {
        const subcategory = await this.subcategoryRepository.findByName(request.subcategoryName);
        if (!subcategory) {
            throw new Error(`Subcategory with name "${request.subcategoryName}" not found.`);
        }

        const imageUrls = request.images.length > 0 
            ? await this.fileStorageService.uploadProductImages(request.images)
            : [];

        const product: Omit<Product, 'subcategoryName'> = {
            id: uuidv4(),
            name: request.name,
            manufacturingLocation: request.manufacturingLocation,
            availableQuantity: request.availableQuantity,
            price: request.price,
            size: request.size,
            description: request.description,
            status: request.status,
            images: imageUrls,
            createdAt: new Date()
        };

        return this.productRepository.create(product, subcategory.id);
    }
}
