const TypeVehiculeService = require("../services/typeVehiculeService");
const ResponseJson = require("../utils/ResponseJson");

class TypeVehiculeController {
  static async createTypeVehicule(req, res) {
    try {
      const { libelle, coefficient_estimation, cout_moyen, temps_moyen } =
        req.body;
      const typeVehicule = await TypeVehiculeService.createTypeVehicule(
        libelle,
        coefficient_estimation,
        cout_moyen,
        temps_moyen
      );
      return res.status(201).json(ResponseJson.success({ typeVehicule }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllTypeVehicules(req, res) {
    try {
      const types = await TypeVehiculeService.getAllTypeVehicules();
      return res.status(200).json(ResponseJson.success({ types }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getTypeVehiculeById(req, res) {
    try {
      const type = await TypeVehiculeService.getTypeVehiculeById(req.params.id);
      return res.status(200).json(ResponseJson.success({ type }));
    } catch (error) {
      if (error.message === "Type de véhicule non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async updateTypeVehicule(req, res) {
    try {
      const { libelle, coefficient_estimation, cout_moyen, temps_moyen } =
        req.body;
      const type = await TypeVehiculeService.updateTypeVehicule(
        req.params.id,
        libelle,
        coefficient_estimation,
        cout_moyen,
        temps_moyen
      );
      return res.status(200).json(ResponseJson.success({ type }));
    } catch (error) {
      if (error.message === "Type de véhicule non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deleteTypeVehicule(req, res) {
    try {
      await TypeVehiculeService.deleteTypeVehicule(req.params.id);
      return res.status(200).json(
        ResponseJson.success({
          message: "Type de véhicule supprimé avec succès",
        })
      );
    } catch (error) {
      if (error.message === "Type de véhicule non trouvé") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = TypeVehiculeController;
