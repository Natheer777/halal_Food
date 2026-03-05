import { Router } from "express";
import multer from "multer";
import { getContainer } from "@infrastructure/di/container";
import { OfferController } from "../controllers/OfferController";
import { createOfferValidation, updateOfferValidation } from "../validators/offerValidators";
import { handleValidationResult } from "../validators/validationResultHandler";

const upload = multer();

export function createOfferRouter(): Router {
    const router = Router();
    const container = getContainer();

    const offerController = new OfferController(
        container.getOffersUseCase,
        container.createOfferUseCase,
        container.updateOfferUseCase,
        container.deleteOfferUseCase,
        container.getOfferByProductIdUseCase,
        container.getActiveOffersUseCase
    );

    router.get("/offers", offerController.getOffers.bind(offerController));
    router.get("/offers/active", offerController.getActiveOffers.bind(offerController));
    router.get("/offers/product/:productId", offerController.getByProductId.bind(offerController));
    router.post(
        "/offers",
        upload.none(),
        createOfferValidation,
        handleValidationResult,
        offerController.createOffer.bind(offerController)
    );
    router.put(
        "/offers/:id",
        upload.none(),
        updateOfferValidation,
        handleValidationResult,
        offerController.updateOffer.bind(offerController)
    );
    router.delete("/offers/:id", offerController.deleteOffer.bind(offerController));

    return router;
}
