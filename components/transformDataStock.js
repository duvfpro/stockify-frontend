//This function transformDataStock takes an array of products as input and transforms it into a format suitable for a chart. It first checks if there are any products, and if not, it returns an empty chart data structure. Then it initializes an object to store sales data by category and date. It iterates over each product and, depending on the filter, looks at each category of the product or the product itself. For each category or product, it iterates over each sale of the product. It creates a date object from the sale date and formats the date differently depending on the time filter. Depending on the filter, it uses the category name or the product name. It initializes the category or product in the sales data if it doesn’t exist, and does the same for the date. It then adds the sale quantity to the sales data. If the product has been sold at least once, it adds the product’s stock to the last sale date. After iterating over all products, it gets all unique dates from the sales data and sorts them. It then transforms the sales data into a format suitable for the chart and returns the chart data.

function transformDataStock(products, filter, timeFilter) {
    // If there are no products, return an empty chart data structure
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    // Initialize an object to store sales data by category and date
    let salesByCategoryAndDate = {};
  
    // Iterate over each product
    for (const product of products) {
      // Depending on the filter, we either look at each category of the product or the product itself
      const categoriesOrProducts = filter === 'categories' ? product.category : [product];
      for (const categoryOrProduct of categoriesOrProducts) {
        // Iterate over each sale of the product
        for (const sale of product.soldAt) {
          // Create a date object from the sale date
          const date = new Date(sale.date);
          let key;
          // Depending on the time filter, we format the date differently
          switch (timeFilter) {
            case 'day':
              key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              break;
            case 'week':
              // Use the date of the first day of the week
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
          // Initialize the category or product in the sales data if it doesn't exist
          if (!salesByCategoryAndDate[name]) {
            salesByCategoryAndDate[name] = {};
          }
  
          // Initialize the date in the sales data if it doesn't exist
          if (!salesByCategoryAndDate[name][key]) {
            salesByCategoryAndDate[name][key] = 0;
          }
  
          // Add the sale quantity to the sales data
          salesByCategoryAndDate[name][key] += sale.quantity;
        }
        // Add the product's stock to the last sale date
        if (product.soldAt.length > 0) {
          const lastSaleDate = new Date(product.soldAt[product.soldAt.length - 1].date);
          let lastKey;
          switch (timeFilter) {
            case 'day':
              lastKey = `${lastSaleDate.getFullYear()}-${lastSaleDate.getMonth() + 1}-${lastSaleDate.getDate()}`;
              break;
            case 'week':
              const firstDayOfWeek = lastSaleDate.getDate() - lastSaleDate.getDay();
              const weekStart = new Date(lastSaleDate.setDate(firstDayOfWeek));
              lastKey = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              lastKey = `${lastSaleDate.getFullYear()}-${lastSaleDate.getMonth() + 1}`;
              break;
            default:
              lastKey = lastSaleDate.toISOString();
          }
          salesByCategoryAndDate[categoryOrProduct.name][lastKey] += product.stock;
        }
      }
    }
  
    // Get all unique dates from the sales data and sort them
    const allDates = [...new Set([].concat(...Object.values(salesByCategoryAndDate).map(Object.keys)))].sort();
  
    // Transform the sales data into a format suitable for the chart
    const datasets = Object.entries(salesByCategoryAndDate).map(([categoryOrProductName, sales]) => ({
      label: categoryOrProductName,
      data: allDates.map(date => sales[date] || 0),
    }));

    // Return the chart data
    return {
      labels: allDates,
      datasets: datasets,
    };
  }
  
  export default transformDataStock;
  