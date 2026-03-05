import { body } from "express-validator";

export const createOfferValidation = [
    body("productId")
        .isUUID()
        .withMessage("Product ID must be a valid UUID"),
    body("discountPercentage")
        .isInt({ min: 1, max: 100 })
        .withMessage("Discount percentage must be between 1 and 100"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be either active or inactive")
];

export const updateOfferValidation = [
    body("discountPercentage")
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage("Discount percentage must be between 1 and 100"),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    body("status")
        .optional()
        .isIn(["active", "inactive"])
        .withMessage("Status must be either active or inactive")
];
