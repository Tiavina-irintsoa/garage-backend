const { v2: cloudinary } = require("cloudinary");
const fs = require("fs");

class UploadService {
  static initialize() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  static async uploadImage(filePath, options = {}) {
    try {
      // Upload l'image vers Cloudinary
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
        ...options,
      });

      // Supprime le fichier temporaire après l'upload
      fs.unlinkSync(filePath);

      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
      };
    } catch (error) {
      // En cas d'erreur, on s'assure de supprimer le fichier temporaire
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      throw error;
    }
  }

  static getOptimizedUrl(publicId, options = {}) {
    return cloudinary.url(publicId, {
      fetch_format: "auto",
      quality: "auto",
      ...options,
    });
  }

  static async deleteImage(publicId) {
    try {
      const result = await cloudinary.uploader.destroy(publicId);
      return result.result === "ok";
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UploadService;
