const prisma = require("../utils/prisma");
const TypeVehicule = require("../models/typeVehicule");

class TypeVehiculeService {
  static async createTypeVehicule(
    libelle,
    coefficient_estimation,
    cout_moyen,
    temps_moyen
  ) {
    try {
      const typeVehicule = await prisma.typeVehicule.create({
        data: {
          libelle,
          coefficient_estimation,
          cout_moyen,
          temps_moyen,
        },
      });
      return TypeVehicule.fromJSON(typeVehicule);
    } catch (error) {
      throw error;
    }
  }

  static async getAllTypeVehicules() {
    try {
      const types = await prisma.typeVehicule.findMany();
      return types.map((type) => TypeVehicule.fromJSON(type));
    } catch (error) {
      throw error;
    }
  }

  static async getTypeVehiculeById(id) {
    try {
      const type = await prisma.typeVehicule.findUnique({
        where: { id },
      });
      if (!type) {
        throw new Error("Type de véhicule non trouvé");
      }
      return TypeVehicule.fromJSON(type);
    } catch (error) {
      throw error;
    }
  }

  static async updateTypeVehicule(
    id,
    libelle,
    coefficient_estimation,
    cout_moyen,
    temps_moyen
  ) {
    try {
      const type = await prisma.typeVehicule.update({
        where: { id },
        data: {
          libelle,
          coefficient_estimation,
          cout_moyen,
          temps_moyen,
        },
      });
      return TypeVehicule.fromJSON(type);
    } catch (error) {
      throw error;
    }
  }

  static async deleteTypeVehicule(id) {
    try {
      await prisma.typeVehicule.delete({
        where: { id },
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TypeVehiculeService;
