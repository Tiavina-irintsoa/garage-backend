const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Assurer que le dossier uploads existe
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
console.log("Dossier d'upload : ", uploadDir);

// Configuration de multer pour le stockage temporaire
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("Destination - req:", req.headers);
    console.log("Destination - file:", file);
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Nettoyer le nom du fichier pour Windows
    const cleanFileName = file.originalname.replace(/[^a-zA-Z0-9.]/g, "_");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const finalFileName = uniqueSuffix + "-" + cleanFileName;
    console.log("Nom du fichier final : ", finalFileName);
    cb(null, finalFileName);
  },
});

// Filtre pour n'accepter que les images
const fileFilter = (req, file, cb) => {
  console.log("fileFilter - req:", req.headers);
  console.log("fileFilter - file:", file);
  const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    console.log("Type de fichier non supporté : ", file.mimetype);
    cb(
      new Error("Type de fichier non supporté. Utilisez JPG, PNG ou GIF."),
      false
    );
  }
};

// Configuration de l'upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // Limite à 20MB
  },
});

module.exports = upload;
