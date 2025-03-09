const { validationResult } = require("express-validator");
const RegisterService = require("../services/registerService");
const ResponseJson = require("../utils/ResponseJson");

class RegisterController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ResponseJson.error(errors.array(), 400));
      }

      // Vérifier si le rôle est valide
      const role = req.body.role?.toUpperCase() || "CLIENT";
      if (!["CLIENT", "MECANICIEN"].includes(role)) {
        return res
          .status(400)
          .json(
            ResponseJson.error("Le rôle doit être CLIENT ou MECANICIEN", 400)
          );
      }

      // Pour créer un mécanicien, il faut être manager
      if (role === "MECANICIEN") {
        if (!req.user || req.user.role !== "MANAGER") {
          return res
            .status(403)
            .json(
              ResponseJson.error(
                "Seul un manager peut créer un compte mécanicien",
                403
              )
            );
        }
      }

      const userData = {
        email: req.body.email,
        password: req.body.password,
        nom: req.body.nom,
        prenom: req.body.prenom,
        role: role,
      };

      const result = await RegisterService.initiateRegistration(userData);

      // Si c'est un client, on renvoie le message de vérification
      if (role === "CLIENT") {
        return res.status(200).json(
          ResponseJson.success({
            message:
              "Un code de vérification a été envoyé à votre email. Veuillez vérifier votre email pour finaliser l'inscription.",
            email: result.email,
          })
        );
      }

      // Pour les autres rôles (mécanicien), on renvoie directement l'utilisateur créé
      return res.status(201).json(ResponseJson.success(result, 201));
    } catch (error) {
      return res.status(400).json(ResponseJson.error(error.message, 400));
    }
  }
}

module.exports = RegisterController;
