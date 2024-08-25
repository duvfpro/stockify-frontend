// This function transformDataRestock takes an array of products as input and transforms it into a format suitable for a chart. It first checks if there are any products, and if not, it returns an empty chart data structure. Then it initializes an object to store restock data by category and date. It iterates over each product and, depending on the filter, looks at each category of the product or the product itself. For each category or product, it iterates over each restock of the product. It creates a date object from the restock date and formats the date differently depending on the time filter. Depending on the filter, it uses the category name or the product name. It initializes the category or product in the restock data if it doesn’t exist, and does the same for the date. It then adds the restock quantity to the restock data. After iterating over all products, it gets all unique dates from the restock data and sorts them. It then transforms the restock data into a format suitable for the chart and returns the chart data.

function transformDataRestock(products, filter, timeFilter) {
    // If there are no products, return an empty chart data structure
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    // Initialize an object to store restock data by category and date
    let restocksByCategoryAndDate = {};
  
    // Iterate over each product
    for (const product of products) {
      // Depending on the filter, we either look at each category of the product or the product itself
      const categoriesOrProducts = filter === 'categories' ? product.category : [product];
      for (const categoryOrProduct of categoriesOrProducts) {
        // Iterate over each restock of the product
        for (const restock of product.restockAt) {
          // Create a date object from the restock date
          const date = new Date(restock.date);
          let key;
          // Depending on the time filter, we format the date differently
          switch (timeFilter) {
            case 'day':
              key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              break;
            case 'week':
              const firstDayOfWeek = date.getDate() - date.getDay();
              const weekStart = new Date(date.setDate(firstDayOfWeek));
              key = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              key = `${date.getFullYear()}-${date.getMonth() + 1}`;
              break;
            default:
              key = date.toISOString();
          }
  
          // Depending on the filter, we either use the category name or the product name
          const name = filter === 'categories' ? categoryOrProduct.name : categoryOrProduct.name;
          // Initialize the category or product in the restock data if it doesn't exist
          if (!restocksByCategoryAndDate[name]) {
            restocksByCategoryAndDate[name] = {};
          }
  
          // Initialize the date in the restock data if it doesn't exist
          if (!restocksByCategoryAndDate[name][key]) {
            restocksByCategoryAndDate[name][key] = 0;
          }
  
          // Add the restock quantity to the restock data
          restocksByCategoryAndDate[name][key] += restock.quantity;
        }
      }
    }
  
    // Get all unique dates from the restock data and sort them
    const allDates = [...new Set([].concat(...Object.values(restocksByCategoryAndDate).map(Object.keys)))].sort();
  
    // Transform the restock data into a format suitable for the chart
    const datasets = Object.entries(restocksByCategoryAndDate).map(([categoryOrProductName, restocks]) => ({
      label: categoryOrProductName,
      data: allDates.map(date => restocks[date] || 0),
    }));
  
    // Return the chart data
    return {
      labels: allDates,
      datasets: datasets,
    };
  }
  
  export default transformDataRestock;