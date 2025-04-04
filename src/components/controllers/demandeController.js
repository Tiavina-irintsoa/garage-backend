const DemandeServiceService = require("../services/demandeService");
const ResponseJson = require("../utils/ResponseJson");
const DemandeService = require("../services/demandeService");

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
        photos: req.body.photos || [],
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
              photos: demande.photos,
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
            id_personne: demande.id_personne,
            vehicule: demande.vehicule || null,
            detailServiceIds: demande.detailServiceIds || [],
            estimation: demande.estimation || null,
            description: demande.description || null,
            date_rdv: demande.date_rdv,
            heure_rdv: demande.heure_rdv,
            deadline: demande.deadline || null,
            dateCreation: demande.dateCreation,
            statut: demande.statut,
            reference_paiement: demande.reference_paiement,
            pieces_facture: demande.pieces_facture || [],
            montant_pieces: demande.montant_pieces || null,
            montant_total: demande.montant_total || null,
            date_facturation: demande.date_facturation || null,
            photos: demande.photos || [],
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
            photos: demande.photos || [],
          })),
        })
      );
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getDemandesByStatus(req, res) {
    try {
      const { status } = req.params;
      const demandes = await DemandeService.getDemandesByStatus(status);

      return res.status(200).json(
        ResponseJson.success({
          demandes: demandes.map((demande) => ({
            id: demande.id,
            id_personne: demande.id_personne,
            vehicule: demande.vehicule || null,
            detailServiceIds: demande.detailServiceIds || [],
            estimation: demande.estimation || null,
            description: demande.description || null,
            date_rdv: demande.date_rdv,
            heure_rdv: demande.heure_rdv,
            deadline: demande.deadline || null,
            dateCreation: demande.dateCreation,
            statut: demande.statut,
            reference_paiement: demande.reference_paiement,
            pieces_facture: demande.pieces_facture || [],
            montant_pieces: demande.montant_pieces || null,
            montant_total: demande.montant_total || null,
            date_facturation: demande.date_facturation || null,
            photos: demande.photos || [],
            client: demande.user,
          })),
        })
      );
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes:", error);
      if (error.message === "Statut invalide") {
        return res.status(400).json(ResponseJson.error("Statut invalide", 400));
      }
      return res
        .status(500)
        .json(
          ResponseJson.error("Erreur lors de la récupération des demandes", 500)
        );
    }
  }

  static async getDemandeDetails(req, res) {
    try {
      const { id } = req.params;
      const demandeDetails = await DemandeServiceService.getDemandeDetails(id);

      return res.status(200).json(
        ResponseJson.success({
          demande: {
            id: demandeDetails.id,
            id_personne: demandeDetails.id_personne,
            vehicule: demandeDetails.vehicule || null,
            detailServiceIds: demandeDetails.detailServiceIds || [],
            estimation: demandeDetails.estimation || null,
            description: demandeDetails.description || null,
            date_rdv: demandeDetails.date_rdv,
            heure_rdv: demandeDetails.heure_rdv,
            deadline: demandeDetails.deadline || null,
            dateCreation: demandeDetails.dateCreation,
            statut: demandeDetails.statut,
            reference_paiement: demandeDetails.reference_paiement,
            pieces_facture: demandeDetails.pieces_facture || [],
            montant_pieces: demandeDetails.montant_pieces || null,
            montant_total: demandeDetails.montant_total || null,
            date_facturation: demandeDetails.date_facturation || null,
            photos: demandeDetails.photos || [],
            client: demandeDetails.user,
            services: demandeDetails.services,
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
}

module.exports = DemandeController;
