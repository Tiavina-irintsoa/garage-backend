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
}

module.exports = UserService;
