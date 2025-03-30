const prisma = require("../utils/prisma");
const Modele = require("../models/modele");

class ModeleService {
  static async create(modeleData, prismaClient = prisma) {
    try {
      let modele = await prismaClient.modele.findFirst({
        where: {
          AND: [
            { libelle: modeleData.libelle },
            { marqueId: modeleData.marqueId },
          ],
        },
      });

      // Si le modèle n'existe pas, le créer
      if (!modele) {
        modele = await prismaClient.modele.create({
          data: {
            libelle: modeleData.libelle,
            marqueId: modeleData.marqueId,
          },
        });
      }

      return Modele.fromJSON(modele);
    } catch (error) {
      throw error;
    }
  }

  static async getById(id) {
    try {
      const modele = await prisma.modele.findUnique({
        where: { id },
        include: {
          marque: true,
        },
      });

      if (!modele) {
        throw new Error("Modèle non trouvé");
      }

      return Modele.fromJSON(modele);
    } catch (error) {
      throw error;
    }
  }

  static async getByMarque(marqueId) {
    try {
      const modeles = await prisma.modele.findMany({
        where: { marqueId },
        include: {
          marque: true,
        },
      });

      return modeles.map((modele) => Modele.fromJSON(modele));
    } catch (error) {
      throw error;
    }
  }

  static async getAll() {
    try {
      const modeles = await prisma.modele.findMany({
        include: {
          marque: true,
        },
      });

      return modeles.map((modele) => Modele.fromJSON(modele));
    } catch (error) {
      throw error;
    }
  }

  static async updateModele(id, libelle, marqueId) {
    try {
      const modele = await prisma.modele.update({
        where: { id },
        data: { libelle, marqueId },
      });
      return Modele.fromJSON(modele);
    } catch (error) {
      throw error;
    }
  }

  static async deleteModele(id) {
    try {
      await prisma.modele.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ModeleService;
