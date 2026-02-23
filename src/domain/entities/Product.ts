export enum ProductStatus {
    VISIBLE = "visible",
    HIDDEN = "hidden"
}

export interface Product {
    id: string;
    name: string;
    subcategoryName: string;
    manufacturingLocation: string;
    availableQuantity: number;
    price: number;
    size: string;
    description?: string;
    status: ProductStatus;
    createdAt: Date;
}
