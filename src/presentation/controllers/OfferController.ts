import { Request, Response } from "express";
import { GetOffersUseCase } from "@application/use-cases/offer/GetOffersUseCase";
import { CreateOfferUseCase } from "@application/use-cases/offer/CreateOfferUseCase";
import { UpdateOfferUseCase } from "@application/use-cases/offer/UpdateOfferUseCase";
import { DeleteOfferUseCase } from "@application/use-cases/offer/DeleteOfferUseCase";
import { GetOfferByProductIdUseCase } from "@application/use-cases/offer/GetOfferByProductIdUseCase";
import { GetActiveOffersUseCase } from "@application/use-cases/offer/GetActiveOffersUseCase";

export class OfferController {
    constructor(
        private readonly getOffersUseCase: GetOffersUseCase,
        private readonly createOfferUseCase: CreateOfferUseCase,
        private readonly updateOfferUseCase: UpdateOfferUseCase,
        private readonly deleteOfferUseCase: DeleteOfferUseCase,
        private readonly getOfferByProductIdUseCase: GetOfferByProductIdUseCase,
        private readonly getActiveOffersUseCase: GetActiveOffersUseCase
    ) { }

    async getOffers(req: Request, res: Response): Promise<void> {
        try {
            const offers = await this.getOffersUseCase.execute();
            res.status(200).json(offers);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async createOffer(req: Request, res: Response): Promise<void> {
        try {
            const offer = await this.createOfferUseCase.execute(req.body);
            res.status(201).json(offer);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async updateOffer(req: Request, res: Response): Promise<void> {
        try {
            const offer = await this.updateOfferUseCase.execute({
                id: req.params.id,
                ...req.body
            });
            res.status(200).json(offer);
        } catch (error: any) {
            const status = error.message === "Offer not found" ? 404 : 400;
            res.status(status).json({ message: error.message });
        }
    }

    async deleteOffer(req: Request, res: Response): Promise<void> {
        try {
            await this.deleteOfferUseCase.execute(req.params.id as string);
            res.status(204).send();
        } catch (error: any) {
            const status = error.message === "Offer not found" ? 404 : 500;
            res.status(status).json({ message: error.message });
        }
    }

    async getByProductId(req: Request, res: Response): Promise<void> {
        try {
            const offer = await this.getOfferByProductIdUseCase.execute(req.params.productId as string);
            if (!offer) {
                res.status(404).json({ message: "No offer found for this product" });
                return;
            }
            res.status(200).json(offer);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getActiveOffers(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const result = await this.getActiveOffersUseCase.execute(page, limit);
            res.status(200).json(result);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}
