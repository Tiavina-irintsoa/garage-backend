const { validationResult } = require("express-validator");
const RegisterService = require("../services/registerService");
const ResponseJson = require("../utils/ResponseJson");

class ManagerController {
  static async createManager(req, res) {
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
        role: "MANAGER", // Force le rôle à MANAGER
      };

      const newManager = await RegisterService.register(userData);
      return res.status(201).json(ResponseJson.success(newManager, 201));
    } catch (error) {
      return res.status(400).json(ResponseJson.error(error.message, 400));
    }
  }
}

module.exports = ManagerController;
