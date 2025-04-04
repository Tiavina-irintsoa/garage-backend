const prisma = require("../utils/prisma");
const DemandeService = require("../models/demandeService");
const ModeleService = require("./modeleService");
const ServiceService = require("./serviceService");
const EstimationService = require("./estimationService");
const { PrismaClient, StatutDemande } = require("@prisma/client");

class DemandeServiceService {
  static validateDateTime(date_rdv, heure_rdv) {
    const dateRdv = new Date(date_rdv);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (dateRdv < now) {
      throw new Error(
        "La date du rendez-vous ne peut pas être antérieure à aujourd'hui"
      );
    }

    // Validation du format de l'heure (HH:mm)
    const heureRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
    if (!heureRegex.test(heure_rdv)) {
      throw new Error("Le format de l'heure doit être HH:mm");
    }

    // Validation de la plage horaire (08:00 - 19:00)
    const [heures, minutes] = heure_rdv.split(":").map(Number);
    if (heures < 8 || (heures === 19 && minutes > 0) || heures > 19) {
      throw new Error(
        "Les rendez-vous sont possibles uniquement entre 08:00 et 19:00"
      );
    }

    return true;
  }

  static async validateVehiculeData(vehiculeData, prismaClient) {
    const marque = await prismaClient.marque.findUnique({
      where: { id: vehiculeData.marque.id },
    });

    if (!marque) {
      throw new Error("La marque spécifiée n'existe pas");
    }

    const typeVehicule = await prismaClient.typeVehicule.findUnique({
      where: { id: vehiculeData.type.id },
    });

    if (!typeVehicule) {
      throw new Error("Le type de véhicule spécifié n'existe pas");
    }

    const etatsValides = ["NEUF", "USE", "TRES_USE"];
    if (!etatsValides.includes(vehiculeData.etatVehicule)) {
      throw new Error("L'état du véhicule n'est pas valide");
    }

    const modele = await ModeleService.create(
      {
        libelle: vehiculeData.modele.libelle,
        marqueId: vehiculeData.marque.id,
      },
      prismaClient
    );

    vehiculeData.modele.id = modele.id;

    return { vehiculeData, typeVehicule };
  }

  static async validateAndGetServices(serviceIds, prismaClient) {
    const services = [];
    console.log("serviceIds", serviceIds);
    for (const serviceId of serviceIds) {
      const service = await prismaClient.service.findUnique({
        where: { id: serviceId },
      });
      if (!service) {
        throw new Error(`Le service avec l'ID ${serviceId} n'existe pas`);
      }
      services.push(service);
    }
    return services;
  }

  static async createDemande(demandeData) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: demandeData.id_personne },
      });

      if (!user || user.role !== "CLIENT") {
        throw new Error(
          "Seuls les clients peuvent créer des demandes de service"
        );
      }

      // Validation de la date et de l'heure
      if (!demandeData.date_rdv || !demandeData.heure_rdv) {
        throw new Error("La date et l'heure du rendez-vous sont obligatoires");
      }

      this.validateDateTime(demandeData.date_rdv, demandeData.heure_rdv);

      const { vehiculeData, typeVehicule } = await this.validateVehiculeData(
        demandeData.vehicule,
        prisma
      );

      const services = await this.validateAndGetServices(
        demandeData.liste_services,
        prisma
      );

      const estimation = EstimationService.calculerEstimation(
        services,
        typeVehicule,
        vehiculeData.etatVehicule
      );

      const demande = await prisma.demandeService.create({
        data: {
          id_personne: demandeData.id_personne,
          vehicule: vehiculeData,
          detailServiceIds: services.map((s) => s.id),
          estimation: estimation,
          description: demandeData.description || null,
          date_rdv: new Date(demandeData.date_rdv),
          heure_rdv: demandeData.heure_rdv,
          deadline: new Date(demandeData.date_rdv),
          photos: demandeData.photos || [],
          reference_paiement: `REF-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
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

  static async getDemandesByStatus(status) {
    // Vérifier si le statut est valide
    if (!Object.values(StatutDemande).includes(status)) {
      throw new Error("Statut invalide");
    }

    const demandes = await prisma.demandeService.findMany({
      where: {
        statut: status,
      },
      orderBy: {
        deadline: "asc",
      },
      select: {
        id: true,
        deadline: true,
        date_rdv: true,
        heure_rdv: true,
        vehicule: true,
        description: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
        detailServiceIds: true,
        estimation: true,
        images: true,
        reference_paiement: true,
        montant_total: true,
        montant_pieces: true,
        date_facturation: true,
      },
    });

    return demandes;
  }

  static async getDemandeDetails(id) {
    const demande = await prisma.demandeService.findFirst({
      where: { id },
      select: {
        id: true,
        id_personne: true,
        vehicule: true,
        detailServiceIds: true,
        estimation: true,
        description: true,
        date_rdv: true,
        heure_rdv: true,
        deadline: true,
        dateCreation: true,
        statut: true,
        reference_paiement: true,
        pieces_facture: true,
        montant_pieces: true,
        montant_total: true,
        date_facturation: true,
        photos: true,
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
            telephone: true,
          },
        },
      },
    });

    if (!demande) {
      throw new Error("Demande non trouvée");
    }

    // Récupérer les services associés
    const services = await prisma.service.findMany({
      where: {
        id: {
          in: demande.detailServiceIds,
        },
      },
      select: {
        id: true,
        titre: true,
        description: true,
        cout_base: true,
        temps_base: true,
      },
    });

    // Récupérer les informations complètes des pièces
    const piecesIds = demande.pieces_facture?.map((piece) => piece.id) || [];
    const pieces = await prisma.piece.findMany({
      where: {
        id: {
          in: piecesIds,
        },
      },
      select: {
        id: true,
        nom: true,
        reference: true,
        description: true,
        prix: true,
      },
    });

    // Combiner les informations des pièces avec leurs quantités
    const piecesCompletes =
      demande.pieces_facture?.map((pieceFacture) => {
        const pieceInfo = pieces.find((p) => p.id === pieceFacture.id);
        return {
          ...pieceFacture,
          nom: pieceInfo?.nom || "",
          reference: pieceInfo?.reference || "",
          description: pieceInfo?.description || "",
        };
      }) || [];

    return {
      ...demande,
      services: services,
      pieces_facture: piecesCompletes,
    };
  }
}

module.exports = DemandeServiceService;
