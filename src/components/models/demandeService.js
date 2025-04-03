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
    // Champs de facturation
    this.pieces_facture = data.pieces_facture || null;
    this.montant_pieces = data.montant_pieces || null;
    this.montant_total = data.montant_total || null;
    this.date_facturation = data.date_facturation || null;
  }

  static fromJSON(json) {
    return new DemandeService(json);
  }

  toJSON() {
    const json = {
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

    // Ajouter les champs de facturation s'ils existent
    if (this.pieces_facture) {
      json.pieces_facture = this.pieces_facture;
    }
    if (this.montant_pieces !== null) {
      json.montant_pieces = this.montant_pieces;
    }
    if (this.montant_total !== null) {
      json.montant_total = this.montant_total;
    }
    if (this.date_facturation) {
      json.date_facturation = this.date_facturation;
    }

    return json;
  }
}

module.exports = DemandeService;
