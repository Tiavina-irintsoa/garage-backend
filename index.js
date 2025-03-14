const express = require("express");
const app = express();
const port = 3000;
const cors = require("cors");

// Configuration CORS avec plus de flexibilité
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.FRONT_API || "http://localhost:4200",
      "http://localhost:4200",
    ];
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
  ],
  exposedHeaders: ["Authorization"],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

// Appliquer CORS avant tout autre middleware
app.use(cors(corsOptions));
app.use(express.json());
require("dotenv").config();

// Controllers
const RegisterController = require("./src/components/controllers/registerController");
const LoginController = require("./src/components/controllers/loginController");
const ManagerController = require("./src/components/controllers/managerController");
const VerificationController = require("./src/components/controllers/verificationController");
const UserController = require("./src/components/controllers/userController");
const ServiceController = require("./src/components/controllers/serviceController");
const DemandeController = require("./src/components/controllers/demandeController");
const MarqueController = require("./src/components/controllers/marqueController");
const ModeleController = require("./src/components/controllers/modeleController");
const TypeVehiculeController = require("./src/components/controllers/typeVehiculeController");

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

// Routes protégées
app.get("/api/auth/users/:userId", authMiddleware, UserController.getUserById);
app.get("/api/auth/users", authMiddleware, UserController.getAllUsers);

// Routes des services
app.post("/api/services", authMiddleware, ServiceController.createService);
app.get("/api/services", ServiceController.getAllServices);
app.get("/api/services/all", ServiceController.getAllServicesWithoutPagination);
app.get("/api/services/:id", ServiceController.getServiceById);
app.put("/api/services/:id", authMiddleware, ServiceController.updateService);
app.delete(
  "/api/services/:id",
  authMiddleware,
  ServiceController.deleteService
);

// Routes des demandes de service
app.post("/api/demandes", authMiddleware, DemandeController.createDemande);
// app.get("/api/demandes/:id", authMiddleware, DemandeController.getDemandeById);
app.get(
  "/api/demandes/user",
  authMiddleware,
  DemandeController.getDemandesByUser
);

// Routes des marques
app.post("/api/marques", authMiddleware, MarqueController.createMarque);
app.get("/api/marques", MarqueController.getAllMarques);
app.get("/api/marques/:id", MarqueController.getMarqueById);
app.put("/api/marques/:id", authMiddleware, MarqueController.updateMarque);
app.delete("/api/marques/:id", authMiddleware, MarqueController.deleteMarque);

// Routes des modèles
app.post("/api/modeles", authMiddleware, ModeleController.createModele);
app.get("/api/modeles", ModeleController.getAllModeles);
app.get("/api/modeles/:id", ModeleController.getModeleById);
app.get("/api/modeles/marque/:marqueId", ModeleController.getModelesByMarque);
app.put("/api/modeles/:id", authMiddleware, ModeleController.updateModele);
app.delete("/api/modeles/:id", authMiddleware, ModeleController.deleteModele);

// Routes des types de véhicules
app.post(
  "/api/types-vehicules",
  authMiddleware,
  TypeVehiculeController.createTypeVehicule
);
app.get("/api/types-vehicules", TypeVehiculeController.getAllTypeVehicules);
app.get("/api/types-vehicules/:id", TypeVehiculeController.getTypeVehiculeById);
app.put(
  "/api/types-vehicules/:id",
  authMiddleware,
  TypeVehiculeController.updateTypeVehicule
);
app.delete(
  "/api/types-vehicules/:id",
  authMiddleware,
  TypeVehiculeController.deleteTypeVehicule
);
app.get("/api/marques/:marqueId/modeles", MarqueController.getModelesByMarqueId);

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
