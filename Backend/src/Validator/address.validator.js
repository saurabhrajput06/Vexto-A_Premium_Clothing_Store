import { body, param, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: errors.array(),
    });
  }

  next();
};

// Add Address Validator
export const addressValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("mobile")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("houseName")
    .trim()
    .notEmpty()
    .withMessage("House name is required"),

  body("area")
    .trim()
    .notEmpty()
    .withMessage("Area is required"),

  body("city")
    .trim()
    .notEmpty()
    .withMessage("City is required"),

  body("state")
    .trim()
    .notEmpty()
    .withMessage("State is required"),

  body("country")
    .trim()
    .notEmpty()
    .withMessage("Country is required"),

  body("pincode")
    .trim()
    .notEmpty()
    .withMessage("Pincode is required"),

  body("addressType")
    .optional()
    .trim()
    .isIn(["home", "office", "other"])
    .withMessage("Address type must be home, office, or other"),

  validate,
];

// Update Address Validator
export const updateAddressValidator = [
  param("addressId")
    .isMongoId()
    .withMessage("Invalid address ID format"),

  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty"),

  body("mobile")
    .optional()
    .trim()
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be 10 digits"),

  body("houseName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("House name cannot be empty"),

  body("area")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Area cannot be empty"),

  body("city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),

  body("state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),

  body("country")
  .optional({ checkFalsy: true })
  .trim()
  .notEmpty()
  .withMessage("Country cannot be empty"),

  body("pincode")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Pincode cannot be empty"),

  body("addressType")
    .optional()
    .trim()
    .isIn(["home", "office", "other"])
    .withMessage("Address type must be home, office, or other"),

  validate,
];