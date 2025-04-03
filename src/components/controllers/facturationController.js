const FacturationService = require("../services/facturationService");
const ResponseJson = require("../utils/ResponseJson");

class FacturationController {
  static async createFacture(req, res) {
    try {
      const { pieces } = req.body;
      const { id } = req.params;

      // Validation des données
      if (!pieces || !Array.isArray(pieces)) {
        return res
          .status(400)
          .json(ResponseJson.error("La liste des pièces est requise", 400));
      }

      // Validation de chaque pièce
      for (const piece of pieces) {
        if (!piece.id || !piece.prix || !piece.quantite) {
          return res
            .status(400)
            .json(
              ResponseJson.error(
                "Chaque pièce doit avoir un id, un prix et une quantité",
                400
              )
            );
        }
      }

      const demande = await FacturationService.createFacture(id, pieces);
      return res.status(200).json(ResponseJson.success({ demande }));
    } catch (error) {
      if (error.message === "Demande non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      if (error.message === "La demande n'a pas d'estimation valide") {
        return res.status(400).json(ResponseJson.error(error.message, 400));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getFacture(req, res) {
    try {
      const { id } = req.params;
      const facture = await FacturationService.getFacture(id);
      return res.status(200).json(ResponseJson.success({ facture }));
    } catch (error) {
      if (
        error.message === "Demande non trouvée" ||
        error.message === "Aucune facture trouvée pour cette demande"
      ) {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = FacturationController;
