import { Offer, OfferStatus } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export interface UpdateOfferDTO {
    id: string;
    discountPercentage?: number;
    description?: string;
    status?: OfferStatus;
}

export class UpdateOfferUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(dto: UpdateOfferDTO): Promise<Offer> {
        const offer = await this.offerRepository.findById(dto.id);
        if (!offer) {
            throw new Error("Offer not found");
        }

        return this.offerRepository.update(dto);
    }
}
