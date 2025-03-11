const UserService = require("../services/userService");
const ResponseJson = require("../utils/ResponseJson");

class UserController {
  static async getUserById(req, res) {
    try {
      // Vérification que l'utilisateur demande ses propres informations ou est un MANAGER
      const requestedUserId = req.params.userId;
      if (req.user.role !== "MANAGER" && req.user.userId !== requestedUserId) {
        return res
          .status(403)
          .json(
            ResponseJson.error(
              "Vous n'êtes pas autorisé à accéder à ces informations",
              403
            )
          );
      }

      const user = await UserService.getUserById(requestedUserId);
      return res.status(200).json(ResponseJson.success({ user }));
    } catch (error) {
      if (error.message === "Utilisateur non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = UserController;
