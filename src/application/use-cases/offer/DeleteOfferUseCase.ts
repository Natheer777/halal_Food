import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export class DeleteOfferUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(id: string): Promise<void> {
        const offer = await this.offerRepository.findById(id);
        if (!offer) {
            throw new Error("Offer not found");
        }
        await this.offerRepository.delete(id);
    }
}
