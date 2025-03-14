class Service {
  constructor(titre, description, icone) {
    this.titre = titre;
    this.description = description;
    this.icone = icone;
  }

  static fromJSON(json) {
    return new Service(json.titre, json.description, json.icone);
  }

  toJSON() {
    return {
      titre: this.titre,
      description: this.description,
      icone: this.icone,
    };
  }
}

module.exports = Service;
