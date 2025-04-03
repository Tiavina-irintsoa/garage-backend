const DashboardService = require("../services/dashboardService");
const ResponseJson = require("../utils/ResponseJson");

class DashboardController {
  static async getInscriptionsParMois(req, res) {
    try {
      const annee = parseInt(req.query.annee) || new Date().getFullYear();
      const inscriptions = await DashboardService.getInscriptionsParMois(annee);
      return res.json(ResponseJson.success({ inscriptions }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message));
    }
  }

  static async getChiffreAffaireParMois(req, res) {
    try {
      const annee = parseInt(req.query.annee) || new Date().getFullYear();
      const chiffreAffaire = await DashboardService.getChiffreAffaireParMois(
        annee
      );
      return res.json(ResponseJson.success({ chiffreAffaire }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message));
    }
  }

  static async getServicesPlusDemandes(req, res) {
    try {
      const annee = parseInt(req.query.annee) || new Date().getFullYear();
      const services = await DashboardService.getServicesPlusDemandes(annee);
      return res.json(ResponseJson.success({ services }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message));
    }
  }
}

module.exports = DashboardController;
