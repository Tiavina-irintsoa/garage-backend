const { body } = require("express-validator");

const registerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("nom").notEmpty().withMessage("Le nom est requis"),
  body("prenom").notEmpty().withMessage("Le prénom est requis"),
  body("role")
    .optional()
    .isIn(["CLIENT", "MECANICIEN"])
    .withMessage("Le rôle doit être CLIENT ou MECANICIEN"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password").notEmpty().withMessage("Le mot de passe est requis"),
];

const managerValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caractères"),
  body("nom").notEmpty().withMessage("Le nom est requis"),
  body("prenom").notEmpty().withMessage("Le prénom est requis"),
];

const verificationValidation = [
  body("email").isEmail().withMessage("Email invalide"),
  body("code")
    .isLength({ min: 6, max: 6 })
    .isNumeric()
    .withMessage("Le code doit contenir exactement 6 chiffres"),
];

module.exports = {
  registerValidation,
  loginValidation,
  managerValidation,
  verificationValidation,
};
