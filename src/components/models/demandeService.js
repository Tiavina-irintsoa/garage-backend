class DemandeService {
  constructor(data) {
    this.id = data.id;
    this.id_personne = data.id_personne;
    this.vehicule = data.vehicule;
    this.services = data.services;
    this.estimation = data.estimation;
    this.statut = data.statut;
    this.dateCreation = data.dateCreation;
    this.user = data.user;
    this.description = data.description;
    this.date_rdv = data.date_rdv;
    this.heure_rdv = data.heure_rdv;
    this.photos = data.photos || [];
  }

  static fromJSON(json) {
    return new DemandeService(json);
  }

  toJSON() {
    return {
      id: this.id,
      id_personne: this.id_personne,
      vehicule: this.vehicule,
      dateCreation: this.dateCreation,
      statut: this.statut,
      estimation: this.estimation,
      services: this.services,
      description: this.description,
      date_rdv: this.date_rdv,
      heure_rdv: this.heure_rdv,
      photos: this.photos,
    };
  }
}

module.exports = DemandeService;
