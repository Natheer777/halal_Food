import { Offer } from "@domain/entities/Offer";

export interface IOfferRepository {
    create(offer: Omit<Offer, 'product' | 'createdAt'>): Promise<Offer>;
    findAll(): Promise<Offer[]>;
    findById(id: string): Promise<Offer | null>;
    findByProductId(productId: string): Promise<Offer | null>;
    update(offer: Partial<Offer> & { id: string }): Promise<Offer>;
    delete(id: string): Promise<void>;
    findActiveWithPagination(page: number, limit: number): Promise<{ offers: Offer[], total: number }>;
}
