import { Offer, OfferStatus } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";
import { v4 as uuidv4 } from "uuid";

export interface CreateOfferDTO {
    productId: string;
    discountPercentage: number;
    description?: string;
    status?: OfferStatus;
}

export class CreateOfferUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(dto: CreateOfferDTO): Promise<Offer> {
        const existingOffer = await this.offerRepository.findByProductId(dto.productId);
        if (existingOffer) {
            throw new Error("Offer already exists for this product");
        }

        const offer: Omit<Offer, 'product' | 'createdAt'> = {
            id: uuidv4(),
            productId: dto.productId,
            discountPercentage: dto.discountPercentage,
            description: dto.description,
            status: dto.status || OfferStatus.ACTIVE
        };

        return this.offerRepository.create(offer);
    }
}
