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
        liste_services: req.body.liste_services,
        description: req.body.description,
        date_rdv: req.body.date_rdv,
        heure_rdv: req.body.heure_rdv,
      };

      const demande = await DemandeServiceService.createDemande(demandeData);
      return res.status(201).json(
        ResponseJson.success(
          {
            demande: {
              id: demande.id,
              vehicule: demande.vehicule,
              services: demande.services,
              estimation: demande.estimation,
              description: demande.description,
              statut: demande.statut,
              dateCreation: demande.dateCreation,
              date_rdv: demande.date_rdv,
              heure_rdv: demande.heure_rdv,
            },
          },
          201
        )
      );
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getDemandeById(req, res) {
    try {
      const demande = await DemandeServiceService.getDemandeById(req.params.id);
      return res.status(200).json(
        ResponseJson.success({
          demande: {
            id: demande.id,
            vehicule: demande.vehicule,
            services: demande.services,
            estimation: demande.estimation,
            description: demande.description,
            statut: demande.statut,
            dateCreation: demande.dateCreation,
            client: demande.user,
          },
        })
      );
    } catch (error) {
      if (error.message === "Demande non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getDemandesByUser(req, res) {
    try {
      console.log("user", req.user.userId);
      const demandes = await DemandeServiceService.getDemandesByUser(
        req.user.userId
      );

      return res.status(200).json(
        ResponseJson.success({
          demandes: demandes.map((demande) => ({
            id: demande.id,
            vehicule: demande.vehicule,
            services: demande.services,
            estimation: demande.estimation,
            description: demande.description,
            statut: demande.statut,
            dateCreation: demande.dateCreation,
            date_rdv: demande.date_rdv,
            heure_rdv: demande.heure_rdv,
          })),
        })
      );
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = DemandeController;
