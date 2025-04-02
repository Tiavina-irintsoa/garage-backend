class EstimationService {
  static getFacteurEtat(etatVehicule) {
    const facteurs = {
      NEUF: 1.0,
      USE: 1.2,
      TRES_USE: 1.5,
    };
    return facteurs[etatVehicule] || 1.0;
  }

  static calculerEstimation(services, typeVehicule, etatVehicule) {
    const facteurEtat = this.getFacteurEtat(etatVehicule);

    let coutTotal = 0;
    let tempsTotal = 0;

    for (const service of services) {
      const coutService =
        service.cout_base * typeVehicule.coefficient_estimation * facteurEtat;
      coutTotal += coutService;

      const tempsService =
        service.temps_base * typeVehicule.coefficient_estimation * facteurEtat;
      tempsTotal += tempsService;
    }

    return {
      cout_estime: Math.round(coutTotal * 100) / 100, // Arrondi à 2 décimales
      temps_estime: Math.round(tempsTotal * 10) / 10, // Arrondi à 1 décimale
      details: {
        facteur_etat: facteurEtat,
        coefficient_type: typeVehicule.coefficient_estimation,
      },
    };
  }
}

module.exports = EstimationService;
 