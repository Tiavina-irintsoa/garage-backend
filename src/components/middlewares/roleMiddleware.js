const ResponseJson = require("../utils/ResponseJson");

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user || !req.user.role) {
        return res.status(401).json(ResponseJson.error("Non authentifié", 401));
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res
          .status(403)
          .json(ResponseJson.error("Accès non autorisé pour ce rôle", 403));
      }

      next();
    } catch (error) {
      return res
        .status(500)
        .json(
          ResponseJson.error("Erreur lors de la vérification du rôle", 500)
        );
    }
  };
};

module.exports = {
  checkRole,
};
