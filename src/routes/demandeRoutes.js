const express = require("express");
const router = express.Router();
const { PrismaClient, StatutDemande } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/api/demandes/:status", async (req, res) => {
  try {
    const { status } = req.params;

    // Vérifier si le statut est valide
    if (!Object.values(StatutDemande).includes(status)) {
      return res.status(400).json({
        error: "Statut invalide",
        statutsValides: Object.values(StatutDemande),
      });
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
        // Relation avec le client
        user: {
          select: {
            id: true,
            nom: true,
            prenom: true,
            email: true,
          },
        },
        // Relation avec les détails de service
        detailServiceIds: true,
        // Informations sur le véhicule (déjà inclus dans le champ vehicule)
        estimation: true,
        images: true,
        reference_paiement: true,
      },
    });

    res.json(demandes);
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes:", error);
    res.status(500).json({
      error: "Erreur lors de la récupération des demandes",
      details: error.message,
    });
  }
});

module.exports = router;
