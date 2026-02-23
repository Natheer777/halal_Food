import { Product } from "@domain/entities/Product";

export interface IProductRepository {
    create(product: Omit<Product, 'subcategoryName'>, subcategoryId: string): Promise<Product>;
    findById(id: string): Promise<Product | null>;
    findAll(): Promise<Product[]>;
    update(product: Omit<Product, 'subcategoryName'>, subcategoryId: string): Promise<Product>;
    delete(id: string): Promise<void>;
    findBySubcategoryId(subcategoryId: string): Promise<Product[]>;
    findVisibleWithPagination(page: number, limit: number): Promise<{ products: Product[], total: number }>;
}
