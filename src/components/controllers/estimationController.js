const EstimationService = require("../services/estimationService");
const prisma = require("../utils/prisma");
const ResponseJson = require("../utils/ResponseJson");

class EstimationController {
  static async getEstimationDetails(req, res) {
    try {
      const {
        services: serviceIds,
        type_vehicule_id,
        etat_vehicule,
      } = req.body;

      if (
        !serviceIds ||
        !Array.isArray(serviceIds) ||
        serviceIds.length === 0
      ) {
        return res
          .status(400)
          .json(
            ResponseJson.error(
              "La liste des services est requise et ne peut pas être vide",
              400
            )
          );
      }

      if (!type_vehicule_id) {
        return res
          .status(400)
          .json(ResponseJson.error("L'ID du type de véhicule est requis", 400));
      }

      if (!etat_vehicule) {
        return res
          .status(400)
          .json(ResponseJson.error("L'état du véhicule est requis", 400));
      }

      // Récupération des services
      const services = await prisma.service.findMany({
        where: {
          id: {
            in: serviceIds,
          },
        },
      });

      if (services.length === 0) {
        throw new Error("Aucun service trouvé");
      }

      if (services.length !== serviceIds.length) {
        throw new Error("Certains services spécifiés n'existent pas");
      }

      // Récupération du type de véhicule
      const typeVehicule = await prisma.typeVehicule.findUnique({
        where: { id: type_vehicule_id },
      });

      if (!typeVehicule) {
        throw new Error("Type de véhicule non trouvé");
      }

      // Validation de l'état du véhicule
      const etatsValides = ["NEUF", "USE", "TRES_USE"];
      if (!etatsValides.includes(etat_vehicule)) {
        throw new Error("L'état du véhicule n'est pas valide");
      }

      // Calcul de l'estimation avec EstimationService
      const estimation = EstimationService.calculerEstimation(
        services,
        typeVehicule,
        etat_vehicule
      );

      // Ajout des détails des services
      const detailsServices = services.map((service) => ({
        service: {
          id: service.id,
          titre: service.titre,
          cout_base: service.cout_base,
          temps_base: service.temps_base,
        },
      }));

      return res.status(200).json(
        ResponseJson.success({
          estimation: {
            cout_estime: estimation.cout_estime,
            temps_estime: estimation.temps_estime,
            details: {
              type_vehicule: {
                libelle: typeVehicule.libelle,
                coefficient_estimation: typeVehicule.coefficient_estimation,
              },
              etat_vehicule: {
                etat: etat_vehicule,
                facteur_etat: estimation.details.facteur_etat,
              },
              services: detailsServices,
            },
          },
        })
      );
    } catch (error) {
      if (
        error.message === "Aucun service trouvé" ||
        error.message === "Certains services spécifiés n'existent pas" ||
        error.message === "Type de véhicule non trouvé" ||
        error.message === "L'état du véhicule n'est pas valide"
      ) {
        return res.status(400).json(ResponseJson.error(error.message, 400));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = EstimationController;
