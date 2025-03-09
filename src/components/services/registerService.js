const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");
const EmailService = require("./emailService");
const crypto = require("crypto");

class RegisterService {
  // Map pour stocker temporairement les données d'inscription et les codes
  static pendingRegistrations = new Map();

  static generateVerificationCode() {
    return crypto.randomInt(100000, 999999).toString();
  }

  static async initiateRegistration(userData) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }

      // Si c'est un client, envoyer un code de vérification
      if (userData.role === "CLIENT") {
        const verificationCode = this.generateVerificationCode();
        const verificationExpires = new Date(Date.now() + 3600000); // Expire dans 1 heure

        // Stocker temporairement les données d'inscription
        this.pendingRegistrations.set(userData.email, {
          ...userData,
          verificationCode,
          verificationExpires,
        });

        // Envoyer l'email de vérification
        await EmailService.sendVerificationEmail(
          userData.email,
          verificationCode
        );

        return {
          message: "Un code de vérification a été envoyé à votre email",
          email: userData.email,
        };
      } else {
        // Pour les managers et mécaniciens, créer directement le compte
        return await this.createVerifiedUser(userData);
      }
    } catch (error) {
      throw error;
    }
  }

  static async createVerifiedUser(userData) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        nom: userData.nom,
        prenom: userData.prenom,
        role: userData.role,
        isEmailVerified: true,
      },
    });

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  static async verifyAndCreateUser(email, code) {
    try {
      const pendingUser = this.pendingRegistrations.get(email);

      if (!pendingUser) {
        throw new Error("Aucune inscription en attente trouvée pour cet email");
      }

      if (pendingUser.verificationExpires < new Date()) {
        this.pendingRegistrations.delete(email);
        throw new Error("Le code de vérification a expiré");
      }

      if (pendingUser.verificationCode !== code) {
        throw new Error("Code de vérification invalide");
      }

      // Créer l'utilisateur vérifié
      const user = await this.createVerifiedUser(pendingUser);

      // Supprimer les données temporaires
      this.pendingRegistrations.delete(email);

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RegisterService;
