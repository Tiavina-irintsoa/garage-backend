const MarqueService = require("../services/marqueService");
const ResponseJson = require("../utils/ResponseJson");

class MarqueController {
  static async createMarque(req, res) {
    try {
      const marque = await MarqueService.createMarque(req.body.libelle);
      return res.status(201).json(ResponseJson.success({ marque }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllMarques(req, res) {
    try {
      const marques = await MarqueService.getAllMarques();
      return res.status(200).json(ResponseJson.success({ marques }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getMarqueById(req, res) {
    try {
      const marque = await MarqueService.getMarqueById(req.params.id);
      return res.status(200).json(ResponseJson.success({ marque }));
    } catch (error) {
      if (error.message === "Marque non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async updateMarque(req, res) {
    try {
      const marque = await MarqueService.updateMarque(
        req.params.id,
        req.body.libelle
      );
      return res.status(200).json(ResponseJson.success({ marque }));
    } catch (error) {
      if (error.message === "Marque non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deleteMarque(req, res) {
    try {
      await MarqueService.deleteMarque(req.params.id);
      return res
        .status(200)
        .json(
          ResponseJson.success({ message: "Marque supprimée avec succès" })
        );
    } catch (error) {
      if (error.message === "Marque non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = MarqueController;
