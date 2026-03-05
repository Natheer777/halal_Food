import { Offer } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export class GetOfferByProductIdUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(productId: string): Promise<Offer | null> {
        return this.offerRepository.findByProductId(productId);
    }
}
