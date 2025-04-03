class Piece {
  constructor(id, reference, nom, description, prix, createdAt, updatedAt) {
    this.id = id;
    this.reference = reference;
    this.nom = nom;
    this.description = description;
    this.prix = prix;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static fromJSON(json) {
    return new Piece(
      json.id,
      json.reference,
      json.nom,
      json.description,
      json.prix,
      json.createdAt,
      json.updatedAt
    );
  }

  toJSON() {
    return {
      id: this.id,
      reference: this.reference,
      nom: this.nom,
      description: this.description,
      prix: this.prix,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Piece;
