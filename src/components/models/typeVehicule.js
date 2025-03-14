class TypeVehicule {
  constructor(id, libelle, coefficient_estimation, cout_moyen, temps_moyen) {
    this.id = id;
    this.libelle = libelle;
    this.coefficient_estimation = coefficient_estimation;
    this.cout_moyen = cout_moyen;
    this.temps_moyen = temps_moyen;
  }

  static fromJSON(json) {
    return new TypeVehicule(
      json.id,
      json.libelle,
      json.coefficient_estimation,
      json.cout_moyen,
      json.temps_moyen
    );
  }

  toJSON() {
    return {
      id: this.id,
      libelle: this.libelle,
      coefficient_estimation: this.coefficient_estimation,
      cout_moyen: this.cout_moyen,
      temps_moyen: this.temps_moyen,
    };
  }
}

module.exports = TypeVehicule;
