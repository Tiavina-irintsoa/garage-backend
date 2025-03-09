const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

class AuthService {
  static async register(userData) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        throw new Error("Un utilisateur avec cet email existe déjà");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          nom: userData.nom,
          prenom: userData.prenom,
          role: userData.role || "USER",
        },
      });

      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Email ou mot de passe incorrect");
      }

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
