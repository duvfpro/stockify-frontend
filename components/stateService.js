

class StateService {
  //  initialise la propriété displayProducts comme un tableau vide.
  constructor() {
    this.displayProducts = [];
  }
// défini les produits à afficher dans l'application.
// Prend un paramètre products et met à jour la propriété displayProducts.
  setDisplayProducts(products) {
    this.displayProducts = products;
  }
// récupèrere les produits à afficher dans l'application et Retourne la valeur actuelle de la propriété displayProducts.
  getDisplayProducts() {
    return this.displayProducts;
  }
// (définit les colonnes du tableau dans l'application) en prennant un paramètre columns et met à jour la propriété columns.
 
  setColumns(columns) {
    this.columns = columns;
  }
//  récupère les colonnes du tableau dans l'application et retourne la valeur actuelle de la propriété columns.

  getColumns() {
    return this.columns;
  }
}

export default new StateService();
