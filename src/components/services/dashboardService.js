const prisma = require("../utils/prisma");

class DashboardService {
  static async getInscriptionsParMois(annee) {
    try {
      // Vérifier que l'année est valide
      if (
        !annee ||
        isNaN(annee) ||
        annee < 2000 ||
        annee > new Date().getFullYear()
      ) {
        throw new Error("Année invalide");
      }
      console.log(
        " user CLIENT number and createdAt ",
        await prisma.user.findMany({
          where: {
            role: "CLIENT",
          },
          select: {
            createdAt: true,
          },
        })
      );
      // Récupérer les inscriptions par mois pour l'année donnée
      const inscriptions = await prisma.user.findMany({
        where: {
          role: "CLIENT",
          createdAt: {
            gte: new Date(annee, 0, 1), // 1er janvier de l'année
            lt: new Date(annee + 1, 0, 1), // 1er janvier de l'année suivante
          },
        },
        select: {
          createdAt: true,
        },
      });

      // Initialiser un tableau avec 12 mois (0-11) et des compteurs à 0
      const resultat = Array(12).fill(0);

      // Remplir le tableau avec les données réelles
      inscriptions.forEach((inscription) => {
        const mois = new Date(inscription.createdAt).getMonth();
        resultat[mois]++;
      });

      return resultat;
    } catch (error) {
      throw error;
    }
  }

  static async getChiffreAffaireParMois(annee) {
    try {
      // Vérifier que l'année est valide
      if (
        !annee ||
        isNaN(annee) ||
        annee < 2000 ||
        annee > new Date().getFullYear()
      ) {
        throw new Error("Année invalide");
      }

      // Récupérer les demandes avec montant_total pour l'année donnée
      const demandes = await prisma.demandeService.findMany({
        where: {
          montant_total: {
            not: null,
          },
          date_facturation: {
            gte: new Date(annee, 0, 1), // 1er janvier de l'année
            lt: new Date(annee + 1, 0, 1), // 1er janvier de l'année suivante
          },
        },
        select: {
          date_facturation: true,
          montant_total: true,
        },
      });

      // Initialiser un tableau avec 12 mois (0-11) et des montants à 0
      const resultat = Array(12).fill(0);

      // Remplir le tableau avec les montants réels
      demandes.forEach((demande) => {
        const mois = new Date(demande.date_facturation).getMonth();
        resultat[mois] += demande.montant_total;
      });

      return resultat;
    } catch (error) {
      throw error;
    }
  }

  static async getServicesPlusDemandes(annee) {
    try {
      // Vérifier que l'année est valide
      if (
        !annee ||
        isNaN(annee) ||
        annee < 2000 ||
        annee > new Date().getFullYear()
      ) {
        throw new Error("Année invalide");
      }

      // Récupérer toutes les demandes de l'année
      const demandes = await prisma.demandeService.findMany({
        where: {
          dateCreation: {
            gte: new Date(annee, 0, 1),
            lt: new Date(annee + 1, 0, 1),
          },
        },
        select: {
          detailServiceIds: true,
        },
      });

      // Récupérer tous les services
      const services = await prisma.service.findMany({
        select: {
          id: true,
          titre: true,
        },
      });

      // Compter le nombre total d'utilisations de services
      let totalUtilisations = 0;
      const serviceCounts = {};

      demandes.forEach((demande) => {
        demande.detailServiceIds.forEach((serviceId) => {
          serviceCounts[serviceId] = (serviceCounts[serviceId] || 0) + 1;
          totalUtilisations++;
        });
      });

      // Créer un tableau avec tous les services et leur pourcentage d'utilisation
      const resultat = services.map((service) => ({
        id: service.id,
        titre: service.titre,
        pourcentage:
          totalUtilisations > 0
            ? (
                ((serviceCounts[service.id] || 0) / totalUtilisations) *
                100
              ).toFixed(2)
            : "0.00",
      }));

      // Trier par pourcentage (décroissant)
      return resultat.sort(
        (a, b) => parseFloat(b.pourcentage) - parseFloat(a.pourcentage)
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = DashboardService;
