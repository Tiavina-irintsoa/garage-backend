const ModeleService = require("../services/modeleService");
const ResponseJson = require("../utils/ResponseJson");

class ModeleController {
  static async createModele(req, res) {
    try {
      const modele = await ModeleService.create({
        libelle: req.body.libelle,
        marqueId: req.body.marqueId,
      });
      return res.status(201).json(ResponseJson.success({ modele }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllModeles(req, res) {
    try {
      const modeles = await ModeleService.getAll();
      return res.status(200).json(ResponseJson.success({ modeles }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getModeleById(req, res) {
    try {
      const modele = await ModeleService.getById(req.params.id);
      return res.status(200).json(ResponseJson.success({ modele }));
    } catch (error) {
      if (error.message === "Modèle non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async updateModele(req, res) {
    try {
      const modele = await ModeleService.updateModele(
        req.params.id,
        req.body.libelle,
        req.body.marqueId
      );
      return res.status(200).json(ResponseJson.success({ modele }));
    } catch (error) {
      if (error.message === "Modèle non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deleteModele(req, res) {
    try {
      await ModeleService.deleteModele(req.params.id);
      return res
        .status(200)
        .json(ResponseJson.success({ message: "Modèle supprimé avec succès" }));
    } catch (error) {
      if (error.message === "Modèle non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getModelesByMarque(req, res) {
    try {
      const modeles = await ModeleService.getByMarque(req.params.marqueId);
      return res.status(200).json(ResponseJson.success({ modeles }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = ModeleController;
