import { Offer } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export class GetOffersUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(): Promise<Offer[]> {
        return this.offerRepository.findAll();
    }
}
