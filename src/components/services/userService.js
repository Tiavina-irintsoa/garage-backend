const prisma = require("../utils/prisma");

class UserService {
  static async getUserById(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          nom: true,
          prenom: true,
          role: true,
          isEmailVerified: true,
          createdAt: true,
          updatedAt: true,
          // On exclut le mot de passe pour des raisons de sécurité
        },
      });
      if (!user) {
        throw new Error("Utilisateur non trouvé");
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers(options = {}) {
    try {
      const { page = 1, limit = 10, role, isEmailVerified, search } = options;

      const skip = (page - 1) * limit;

      // Construction du filtre
      const where = {};
      if (role) where.role = role;
      if (isEmailVerified !== undefined)
        where.isEmailVerified = isEmailVerified;
      if (search) {
        where.OR = [
          { email: { contains: search, mode: "insensitive" } },
          { nom: { contains: search, mode: "insensitive" } },
          { prenom: { contains: search, mode: "insensitive" } },
        ];
      }

      // Récupération des utilisateurs avec pagination
      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: {
            id: true,
            email: true,
            nom: true,
            prenom: true,
            role: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
          },
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
        }),
        prisma.user.count({ where }),
      ]);

      return {
        users,
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
}

module.exports = UserService;
