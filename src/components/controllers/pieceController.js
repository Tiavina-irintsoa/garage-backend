const PieceService = require("../services/pieceService");
const ResponseJson = require("../utils/ResponseJson");

class PieceController {
  static async createPiece(req, res) {
    try {
      const piece = await PieceService.createPiece(req.body);
      return res.status(201).json(ResponseJson.success({ piece }, 201));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getAllPieces(req, res) {
    try {
      const pieces = await PieceService.getAllPieces();
      return res.status(200).json(ResponseJson.success({ pieces }));
    } catch (error) {
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async getPieceById(req, res) {
    try {
      const piece = await PieceService.getPieceById(req.params.id);
      return res.status(200).json(ResponseJson.success({ piece }));
    } catch (error) {
      if (error.message === "Pièce non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async updatePiece(req, res) {
    try {
      const piece = await PieceService.updatePiece(req.params.id, req.body);
      return res.status(200).json(ResponseJson.success({ piece }));
    } catch (error) {
      if (error.message === "Pièce non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }

  static async deletePiece(req, res) {
    try {
      await PieceService.deletePiece(req.params.id);
      return res
        .status(200)
        .json(ResponseJson.success({ message: "Pièce supprimée avec succès" }));
    } catch (error) {
      if (error.message === "Pièce non trouvée") {
        return res.status(404).json(ResponseJson.error(error.message, 404));
      }
      return res.status(500).json(ResponseJson.error(error.message, 500));
    }
  }
}

module.exports = PieceController;
