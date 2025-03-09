const { validationResult } = require("express-validator");
const LoginService = require("../services/loginService");
const ResponseJson = require("../utils/ResponseJson");

class LoginController {
  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json(ResponseJson.error(errors.array(), 400));
      }

      const { email, password } = req.body;
      const result = await LoginService.login(email, password);

      return res.status(200).json(ResponseJson.success(result, 200));
    } catch (error) {
      return res.status(401).json(ResponseJson.error(error.message, 401));
    }
  }
}

module.exports = LoginController;
