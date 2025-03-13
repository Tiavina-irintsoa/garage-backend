class DemandeService {
  constructor(id_personne, vehicule) {
    this.id_personne = id_personne;
    this.vehicule = vehicule;
    this.dateCreation = new Date();
    this.statut = "EN_ATTENTE"; // EN_ATTENTE, ACCEPTEE, REFUSEE, EN_COURS, TERMINEE
  }

  static fromJSON(json) {
    return new DemandeService(json.id_personne, json.vehicule);
  }

  toJSON() {
    return {
      id_personne: this.id_personne,
      vehicule: this.vehicule,
      dateCreation: this.dateCreation,
      statut: this.statut,
    };
  }
}

module.exports = DemandeService;
