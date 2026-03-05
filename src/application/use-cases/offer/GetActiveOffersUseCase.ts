import { Offer } from "@domain/entities/Offer";
import { IOfferRepository } from "@domain/repositories/IOfferRepository";

export interface GetActiveOffersResponse {
    offers: Offer[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export class GetActiveOffersUseCase {
    constructor(private readonly offerRepository: IOfferRepository) { }

    async execute(page: number, limit: number): Promise<GetActiveOffersResponse> {
        const { offers, total } = await this.offerRepository.findActiveWithPagination(page, limit);
        const totalPages = Math.ceil(total / limit);

        return {
            offers,
            total,
            page,
            limit,
            totalPages
        };
    }
}
