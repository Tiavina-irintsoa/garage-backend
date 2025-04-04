const prisma = require("../utils/prisma");
const Service = require("../models/service");

class ServiceService {
  static async createService(serviceData) {
    try {
      if (
        !serviceData.cout_base ||
        typeof serviceData.cout_base !== "number" ||
        serviceData.cout_base <= 0
      ) {
        throw new Error("Le coût de base doit être un nombre positif");
      }
      if (
        !serviceData.temps_base ||
        typeof serviceData.temps_base !== "number" ||
        serviceData.temps_base <= 0
      ) {
        throw new Error("Le temps de base doit être un nombre positif");
      }

      const service = await prisma.service.create({
        data: {
          titre: serviceData.titre,
          description: serviceData.description,
          icone: serviceData.icone,
          cout_base: serviceData.cout_base,
          temps_base: serviceData.temps_base,
        },
      });
      return Service.fromJSON(service);
    } catch (error) {
      throw error;
    }
  }

  static async getAllServices(options = {}) {
    try {
      const { page = 1, limit = 10, search } = options;
      const skip = (page - 1) * limit;

      // Construction du filtre
      const where = {};
      if (search) {
        where.OR = [
          { titre: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
          { icone: { contains: search, mode: "insensitive" } },
        ];
      }

      // Récupération des services avec pagination
      const [services, total] = await Promise.all([
        prisma.service.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.service.count({ where }),
      ]);

      return {
        services: services.map((service) => Service.fromJSON(service)),
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw error;
    }
  }

  static async getAllServicesWithoutPagination() {
    try {
      const services = await prisma.service.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          titre: true,
          description: true,
          icone: true,
          cout_base: true,
          temps_base: true,
        },
      });

      return services.map((service) => Service.fromJSON(service));
    } catch (error) {
      throw error;
    }
  }

  static async getServiceById(id) {
    try {
      const service = await prisma.service.findUnique({
        where: { id },
      });

      if (!service) {
        throw new Error("Service non trouvé");
      }

      return Service.fromJSON(service);
    } catch (error) {
      throw error;
    }
  }

  static async updateService(id, serviceData) {
    try {
      // Validation des données pour la mise à jour
      if (
        serviceData.cout_base &&
        (typeof serviceData.cout_base !== "number" ||
          serviceData.cout_base <= 0)
      ) {
        throw new Error("Le coût de base doit être un nombre positif");
      }
      if (
        serviceData.temps_base &&
        (typeof serviceData.temps_base !== "number" ||
          serviceData.temps_base <= 0)
      ) {
        throw new Error("Le temps de base doit être un nombre positif");
      }

      const service = await prisma.service.update({
        where: { id },
        data: {
          titre: serviceData.titre,
          description: serviceData.description,
          icone: serviceData.icone,
          cout_base: serviceData.cout_base,
          temps_base: serviceData.temps_base,
        },
      });

      return Service.fromJSON(service);
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Service non trouvé");
      }
      throw error;
    }
  }

  static async deleteService(id) {
    try {
      await prisma.service.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Service non trouvé");
      }
      throw error;
    }
  }
}

module.exports = ServiceService;
