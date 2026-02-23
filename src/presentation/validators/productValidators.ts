import { body, param } from "express-validator";

export const createProductValidation = [
    body("name")
        .isString()
        .withMessage("Name must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Name is required."),
    body("subcategoryName")
        .isString()
        .withMessage("Subcategory name must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Subcategory name is required."),
    body("manufacturingLocation")
        .isString()
        .withMessage("Manufacturing location must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Manufacturing location is required."),
    body("availableQuantity")
        .isInt({ min: 0 })
        .withMessage("Available quantity must be a non-negative integer."),
    body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number."),
    body("size")
        .isString()
        .withMessage("Size must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Size is required."),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string.")
        .trim(),
    body("status")
        .isIn(["visible", "hidden"])
        .withMessage("Status must be either 'visible' or 'hidden'.")
];

export const updateProductValidation = [
    param("id")
        .isUUID()
        .withMessage("Product ID must be a valid UUID."),
    body("name")
        .optional()
        .isString()
        .withMessage("Name must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty."),
    body("subcategoryName")
        .optional()
        .isString()
        .withMessage("Subcategory name must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Subcategory name cannot be empty."),
    body("manufacturingLocation")
        .optional()
        .isString()
        .withMessage("Manufacturing location must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Manufacturing location cannot be empty."),
    body("availableQuantity")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Available quantity must be a non-negative integer."),
    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number."),
    body("size")
        .optional()
        .isString()
        .withMessage("Size must be a string.")
        .trim()
        .notEmpty()
        .withMessage("Size cannot be empty."),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string.")
        .trim(),
    body("status")
        .optional()
        .isIn(["visible", "hidden"])
        .withMessage("Status must be either 'visible' or 'hidden'.")
];

export const productIdValidation = [
    param("id")
        .isUUID()
        .withMessage("Product ID must be a valid UUID.")
];
