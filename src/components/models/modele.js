class Modele {
  constructor(id, libelle, marqueId) {
    this.id = id;
    this.libelle = libelle;
    this.marqueId = marqueId;
  }

  static fromJSON(json) {
    return new Modele(json.id, json.libelle, json.marqueId);
  }

  toJSON() {
    return {
      id: this.id,
      libelle: this.libelle,
      marqueId: this.marqueId,
    };
  }
}

module.exports = Modele;
