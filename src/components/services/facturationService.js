const prisma = require("../utils/prisma");
const DemandeService = require("../models/demandeService");

class FacturationService {
  static async createFacture(demandeId, pieces) {
    try {
      // Récupérer la demande avec l'estimation
      const demande = await prisma.demandeService.findUnique({
        where: { id: demandeId },
      });

      if (!demande) {
        throw new Error("Demande non trouvée");
      }

      // Vérifier que la demande a une estimation
      if (!demande.estimation || !demande.estimation.cout_estime) {
        throw new Error("La demande n'a pas d'estimation valide");
      }

      // Calculer le montant total des pièces
      const montantPieces = pieces.reduce((total, piece) => {
        return total + piece.prix * piece.quantite;
      }, 0);

      // Calculer le montant total (estimation + pièces)
      const montantTotal = demande.estimation.cout_estime + montantPieces;

      // Mettre à jour la demande avec les informations de facturation
      const demandeMiseAJour = await prisma.demandeService.update({
        where: { id: demandeId },
        data: {
          pieces_facture: pieces,
          montant_pieces: montantPieces,
          montant_total: montantTotal,
          date_facturation: new Date(),
          statut: "ATTENTE_FACTURATION",
        },
      });

      return DemandeService.fromJSON(demandeMiseAJour);
    } catch (error) {
      throw error;
    }
  }

  static async getFacture(demandeId) {
    try {
      const demande = await prisma.demandeService.findUnique({
        where: { id: demandeId },
      });

      if (!demande) {
        throw new Error("Demande non trouvée");
      }

      if (!demande.montant_total) {
        throw new Error("Aucune facture trouvée pour cette demande");
      }

      return {
        estimation: demande.estimation,
        pieces: demande.pieces_facture,
        montant_pieces: demande.montant_pieces,
        montant_total: demande.montant_total,
        date_facturation: demande.date_facturation,
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FacturationService;
