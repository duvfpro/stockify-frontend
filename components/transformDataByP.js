
function transformDataByP(product, timeFilter) {
  // Filtrer les transactions en fonction du filtre de temps
  const now = new Date();
  const transactions = product.soldAt.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    switch (timeFilter) {
      case 'day':
        return now - transactionDate < 24 * 60 * 60 * 1000; // 24 heures
      case 'week':
        return now - transactionDate < 7 * 24 * 60 * 60 * 1000; // 7 jours
      case 'month':
        return now - transactionDate < 30 * 24 * 60 * 60 * 1000; // 30 jours
      default:
        return true;
    }
  });

  // Trier les transactions par date
  const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

  // Créer les labels (dates) et les données (quantités)
  const labels = sortedTransactions.map(transaction => transaction.date);
  const data = sortedTransactions.map(transaction => transaction.quantity);

  // Créer l'objet de données pour le graphique
  const chartData = {
      labels: labels,
      datasets: [{
          label: product.name,
          data: data,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
      }]
  };

  return chartData;
}


  export default  transformDataByP