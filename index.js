const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());
require("dotenv").config();

// Controllers
const RegisterController = require("./src/components/controllers/registerController");
const LoginController = require("./src/components/controllers/loginController");
const ManagerController = require("./src/components/controllers/managerController");
const VerificationController = require("./src/components/controllers/verificationController");

// Middlewares
const {
  registerValidation,
  loginValidation,
  managerValidation,
  verificationValidation,
} = require("./src/components/middlewares/authValidation");
const { checkRole } = require("./src/components/middlewares/roleMiddleware");
const authMiddleware = require("./src/components/utils/authMiddleware");
const errorHandler = require("./src/components/middlewares/errorMiddleware");
const ResponseJson = require("./src/components/utils/ResponseJson");

// Database
const prisma = require("./src/components/utils/prisma");

// Routes d'authentification publiques
app.post("/api/auth/register", registerValidation, RegisterController.register);
app.post("/api/auth/login", loginValidation, LoginController.login);
app.post(
  "/api/auth/manager",
  managerValidation,
  ManagerController.createManager
);
app.post(
  "/api/auth/verify",
  verificationValidation,
  VerificationController.verifyEmail
);

// Route protégée exemple
app.get("/api/protected", authMiddleware, (req, res) => {
  res.json({
    message: "Cette route est protégée",
    user: req.user,
  });
});

// Route de status
app.get("/api/status", async (req, res) => {
  try {
    await prisma.$connect();
    res.json({
      status: "connected",
      message: "Database connection is healthy",
    });
  } catch (error) {
    res.json({
      status: "disconnected",
      message: "Database connection is not established",
    });
  }
});

// Gestion des erreurs
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
