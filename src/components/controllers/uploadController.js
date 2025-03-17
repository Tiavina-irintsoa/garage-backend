const UploadService = require("../services/uploadService");
const ResponseJson = require("../utils/ResponseJson");

class UploadController {
  static async uploadImage(req, res) {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json(ResponseJson.error("Aucun fichier n'a été uploadé", 400));
      }
      console.log(req.file);
      // Options pour Cloudinary (dossier et transformation)
      const options = {
        folder: "garage", // Dossier dans Cloudinary
        transformation: [
          { width: 1000, crop: "limit" }, // Redimensionne si plus large que 1000px
          { quality: "auto" }, // Optimisation automatique de la qualité
          { fetch_format: "auto" }, // Format optimal selon le navigateur
        ],
      };

      // Upload vers Cloudinary
      console.log(req.file.path);
      const uploadResult = await UploadService.uploadImage(
        req.file.path,
        options
      );

      return res.status(201).json(
        ResponseJson.success({
          image: {
            url: uploadResult.url,
            public_id: uploadResult.public_id,
            format: uploadResult.format,
            width: uploadResult.width,
            height: uploadResult.height,
          },
        })
      );
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deleteImage(req, res) {
    try {
      const { public_id } = req.params;

      if (!public_id) {
        return res
          .status(400)
          .json(ResponseJson.error("L'ID public de l'image est requis", 400));
      }

      const result = await UploadService.deleteImage(public_id);

      if (result) {
        return res
          .status(200)
          .json(
            ResponseJson.success({ message: "Image supprimée avec succès" })
          );
      } else {
        throw new Error("Échec de la suppression de l'image");
      }
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = UploadController;
