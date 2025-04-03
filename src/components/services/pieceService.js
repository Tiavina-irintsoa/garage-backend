const prisma = require("../utils/prisma");
const Piece = require("../models/piece");

class PieceService {
  static async createPiece(pieceData) {
    try {
      const piece = await prisma.piece.create({
        data: {
          reference: pieceData.reference,
          nom: pieceData.nom,
          description: pieceData.description,
          prix: pieceData.prix,
        },
      });
      return Piece.fromJSON(piece);
    } catch (error) {
      throw error;
    }
  }

  static async getAllPieces() {
    try {
      const pieces = await prisma.piece.findMany();
      return pieces.map((piece) => Piece.fromJSON(piece));
    } catch (error) {
      throw error;
    }
  }

  static async getPieceById(id) {
    try {
      const piece = await prisma.piece.findUnique({
        where: { id },
      });

      if (!piece) {
        throw new Error("Pièce non trouvée");
      }

      return Piece.fromJSON(piece);
    } catch (error) {
      throw error;
    }
  }

  static async updatePiece(id, pieceData) {
    try {
      const piece = await prisma.piece.update({
        where: { id },
        data: {
          reference: pieceData.reference,
          nom: pieceData.nom,
          description: pieceData.description,
          prix: pieceData.prix,
        },
      });
      return Piece.fromJSON(piece);
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Pièce non trouvée");
      }
      throw error;
    }
  }

  static async deletePiece(id) {
    try {
      await prisma.piece.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Pièce non trouvée");
      }
      throw error;
    }
  }
}

module.exports = PieceService;
