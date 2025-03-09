const { validationResult } = require("express-validator");
const RegisterService = require("../services/registerService");
const ResponseJson = require("../utils/ResponseJson");

class VerificationController {
  static async verifyEmail(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ResponseJson.error(errors.array(), 400));
      }

      const { email, code } = req.body;
      const verifiedUser = await RegisterService.verifyAndCreateUser(
        email,
        code
      );

      return res.status(201).json(
        ResponseJson.success({
          message: "Compte créé et vérifié avec succès",
          user: verifiedUser,
        })
      );
    } catch (error) {
      return res.status(400).json(ResponseJson.error(error.message, 400));
    }
  }
}

module.exports = VerificationController;
