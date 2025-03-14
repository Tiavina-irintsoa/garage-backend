const DemandeServiceService = require("../services/demandeService");
const ResponseJson = require("../utils/ResponseJson");

class DemandeController {
  static async createDemande(req, res) {
    try {
      // Vérifier que l'utilisateur est un client
      if (req.user.role !== "CLIENT") {
        return res
          .status(403)
          .json(
            ResponseJson.error(
              "Seuls les clients peuvent créer des demandes de service",
              403
            )
          );
      }

      const demandeData = {
        id_personne: req.user.userId,
        vehicule: req.body.vehicule,
      };

      const demande = await DemandeServiceService.createDemande(demandeData);
      return res.status(201).json(ResponseJson.success({ demande }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getDemandeById(req, res) {
    try {
      const demande = await DemandeServiceService.getDemandeById(req.params.id);
      return res.status(200).json(ResponseJson.success({ demande }));
    } catch (error) {
      if (error.message === "Demande non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getDemandesByUser(req, res) {
    try {
      const demandes = await DemandeServiceService.getDemandesByUser(
        req.user.userId
      );
      return res.status(200).json(ResponseJson.success({ demandes }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = DemandeController;
