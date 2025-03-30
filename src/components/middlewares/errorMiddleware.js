const ResponseJson = require("../utils/ResponseJson");

const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Gestion des erreurs Prisma
  if (error.code && error.code.startsWith("P")) {
    return res
      .status(400)
      .json(ResponseJson.error("Erreur de base de données", 400));
  }

  // Erreur par défaut
  res.status(500).json(ResponseJson.error("Une erreur est survenue", 500));
};

module.exports = errorHandler;
