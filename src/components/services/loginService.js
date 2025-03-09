const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const prisma = require("../utils/prisma");

class LoginService {
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

      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET n'est pas défini");
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

module.exports = LoginService;
