class Marque {
  constructor(id, libelle) {
    this.id = id;
    this.libelle = libelle;
  }

  static fromJSON(json) {
    return new Marque(json.id, json.libelle);
  }

  toJSON() {
    return {
      id: this.id,
      libelle: this.libelle,
    };
  }
}

module.exports = Marque;
