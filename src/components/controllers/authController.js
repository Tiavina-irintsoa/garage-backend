const { validationResult } = require("express-validator");
const AuthService = require("../services/authService");
const ResponseJson = require("../utils/ResponseJson");

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ResponseJson.error(errors.array(), 400));
      }

      const userData = {
        email: req.body.email,
        password: req.body.password,
        nom: req.body.nom,
        prenom: req.body.prenom,
        role: req.body.role || "user",
      };

      const newUser = await AuthService.register(userData);
      return res.status(201).json(ResponseJson.success(newUser, 201));
    } catch (error) {
      return res.status(400).json(ResponseJson.error(error.message, 400));
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ResponseJson.error(errors.array(), 400));
      }

      const { email, password } = req.body;
      const result = await AuthService.login(email, password);

      return res.status(200).json(ResponseJson.success(result, 200));
    } catch (error) {
      return res.status(401).json(ResponseJson.error(error.message, 401));
    }
  }
}

module.exports = AuthController;
