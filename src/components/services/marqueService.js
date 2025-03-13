const prisma = require("../utils/prisma");
const Marque = require("../models/marque");

class MarqueService {
  static async createMarque(libelle) {
    try {
      const marque = await prisma.marque.create({
        data: { libelle },
      });
      return Marque.fromJSON(marque);
    } catch (error) {
      throw error;
    }
  }

  static async getAllMarques() {
    try {
      const marques = await prisma.marque.findMany();
      return marques.map((marque) => Marque.fromJSON(marque));
    } catch (error) {
      throw error;
    }
  }

  static async getMarqueById(id) {
    try {
      const marque = await prisma.marque.findUnique({
        where: { id },
      });
      if (!marque) {
        throw new Error("Marque non trouvée");
      }
      return Marque.fromJSON(marque);
    } catch (error) {
      throw error;
    }
  }

  static async updateMarque(id, libelle) {
    try {
      const marque = await prisma.marque.update({
        where: { id },
        data: { libelle },
      });
      return Marque.fromJSON(marque);
    } catch (error) {
      throw error;
    }
  }

  static async deleteMarque(id) {
    try {
      await prisma.marque.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = MarqueService;
