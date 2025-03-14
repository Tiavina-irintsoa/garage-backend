const prisma = require("../utils/prisma");
const DemandeService = require("../models/demandeService");

class DemandeServiceService {
  static async createDemande(demandeData) {
    try {
      // Vérifier que l'utilisateur est un client
      const user = await prisma.user.findUnique({
        where: { id: demandeData.id_personne },
      });

      if (!user || user.role !== "CLIENT") {
        throw new Error(
          "Seuls les clients peuvent créer des demandes de service"
        );
      }

      // Créer la demande
      const demande = await prisma.demandeService.create({
        data: {
          id_personne: demandeData.id_personne,
          vehicule: demandeData.vehicule,
        },
      });

      return DemandeService.fromJSON(demande);
    } catch (error) {
      throw error;
    }
  }

  static async getDemandeById(id) {
    try {
      const demande = await prisma.demandeService.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              nom: true,
              prenom: true,
            },
          },
        },
      });

      if (!demande) {
        throw new Error("Demande non trouvée");
      }

      return DemandeService.fromJSON(demande);
    } catch (error) {
      throw error;
    }
  }

  static async getDemandesByUser(userId) {
    try {
      const demandes = await prisma.demandeService.findMany({
        where: { id_personne: userId },
        orderBy: { dateCreation: "desc" },
      });

      return demandes.map((demande) => DemandeService.fromJSON(demande));
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DemandeServiceService;
