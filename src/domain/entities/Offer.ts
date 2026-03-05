import { Product } from "./Product";

export enum OfferStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}

export interface Offer {
    id: string;
    productId: string;
    discountPercentage: number;
    description?: string;
    status: OfferStatus;
    product?: Product;
    createdAt: Date;
}
