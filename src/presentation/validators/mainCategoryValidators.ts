import { body } from "express-validator";

export const createMainCategoryValidation = [
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters."),
  body("image").custom((_, { req }) => {
    if (!req.file) {
      throw new Error("Image file is required.");
    }
    return true;
  })
];

export const updateMainCategoryValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string.")
    .bail()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Name must be at most 100 characters."),
  body("image").custom((_, { req }) => {
    if (req.file && !req.file.mimetype.startsWith("image/")) {
      throw new Error("Image must be a valid image file.");
    }
    return true;
  })
];

