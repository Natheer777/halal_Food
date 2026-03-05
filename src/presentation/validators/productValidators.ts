import { body, param } from "express-validator";

export const createProductValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .bail()
        .isString()
        .withMessage("Name must be a string."),
    body("subcategoryName")
        .trim()
        .notEmpty()
        .withMessage("Subcategory name is required.")
        .bail()
        .isString()
        .withMessage("Subcategory name must be a string."),
    body("manufacturingLocation")
        .trim()
        .notEmpty()
        .withMessage("Manufacturing location is required.")
        .bail()
        .isString()
        .withMessage("Manufacturing location must be a string."),
    body("availableQuantity")
        .notEmpty()
        .withMessage("Available quantity is required.")
        .bail()
        .isInt({ min: 0 })
        .withMessage("Available quantity must be a non-negative integer."),
    body("price")
        .notEmpty()
        .withMessage("Price is required.")
        .bail()
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative number."),
    body("size")
        .trim()
        .notEmpty()
        .withMessage("Size is required.")
        .bail()
        .isString()
        .withMessage("Size must be a string."),
    body("description")
        .optional({ values: "falsy" })
        .isString()
        .withMessage("Description must be a string.")
        .trim(),
    body("status")
        .notEmpty()
        .withMessage("Status is required.")
        .bail()
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
