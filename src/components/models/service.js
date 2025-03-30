class Service {
  constructor(data) {
    this.id = data.id;
    this.titre = data.titre;
    this.description = data.description;
    this.icone = data.icone;
    this.cout_base = data.cout_base;
    this.temps_base = data.temps_base;
  }

  static fromJSON(json) {
    return new Service(json);
  }

  toJSON() {
    return {
      id: this.id,
      titre: this.titre,
      description: this.description,
      icone: this.icone,
      cout_base: this.cout_base,
      temps_base: this.temps_base,
    };
  }
}

module.exports = Service;
