import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";
import AddStock from "./AddStock";
import Sale from "./Sale";
import { Table } from "antd";
import FilterDate from './Tools/FilterDate';

// Importe CategoryScale de Chart.js pour la mise à l'échelle des catégories sur les graphiques.
import { CategoryScale } from "chart.js";
// Enregistre CategoryScale pour une utilisation avec Chart.js.
Chart.register(CategoryScale); 
// Importe la version automatique de Chart.js qui sélectionne automatiquement le contrôleur de graphique et l'échelle.
import Chart from "chart.js/auto";
// Importe l'adaptateur date-fns pour Chart.js pour la gestion des dates.
import "chartjs-adapter-date-fns"; 
// Importe le composant Bar de react-chartjs-2 pour la création de graphiques à barres.
import { Bar } from "react-chartjs-2"; 
// Importe le composant Line de react-chartjs-2 pour la création de graphiques linéaires.
import { Line } from "react-chartjs-2"; 

import transformDataSell from "./transformDataSell";

  // Function to handle changes in time selection
  const handleTimeSelectChange = (event) => {
    setTimeFilter(event.target.value);
  };

function Home() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const [openAddStockModal, setOpenAddStockModal] = useState(false);
  const [openSaleModal, setSaleModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [filter, setFilter] = useState('Today');

  const refreshLastSale = () => {

    setRefresh((prevRefresh) => !prevRefresh);
  };

  useEffect(() => {
    if (!user.token) {
      router.push("/");
    }
  }, [user.token, router]);

  const columns = [
    // Schema du tableau
    {
      title: "Product",
      width: 120,
      dataIndex: "product",
    },
    {
      title: "Category",
      width: 120,
      dataIndex: "category",
    },
    {
      title: "Date",
      width: 120,
      dataIndex: "date",
    },
    {
      title: "current Stock ",
      dataIndex: "stock",
      width: 120,
      sorter: (a, b) => a.stock - b.stock,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: "Number of sales",
      dataIndex: "sales",
      width: 120,
      sorter: (a, b) => a.sales - b.sales,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'ascend',
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantitySold",
      width: 120,
      sorter: (a, b) => a.quantitySold - b.quantitySold,
      sortDirections: ['ascend', 'descend', 'ascend'],
      defaultSortOrder: 'ascend',
    },
  ];


  const calculateWeekRange = () => {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
  
    const startDateString = startOfWeek.toISOString().split("T")[0];
    const endDateString = endOfWeek.toISOString().split("T")[0];
  
    return { startDateString, endDateString };
  };


  function convertirFormatDate(dateStr) {
    const dateObj = new Date(dateStr);
  
    const jour = dateObj.getDate().toString().padStart(2, '0');
    const mois = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const annee = dateObj.getFullYear();
  
    const dateFormatee = `${jour}/${mois}/${annee}`;
  
    return dateFormatee;
  }

  
  useEffect(() => {
    // Affiche la liste des produits vendus aujourd'hui
    
    if(filter == 'Today') {

    fetch("http://localhost:3000/products/allProducts")
      .then((response) => response.json())
      .then((data) => {

        const currentDate = new Date();
        const date = currentDate.getDate().toString();
        const month = (currentDate.getMonth() + 1).toString();
        const year = currentDate.getFullYear().toString();

        const todayDateString = `${year}-${month}-${date}`;

        let filteredProducts = data.allProducts.filter((product) => {
          let soldDates = product.soldAt.map((sale) => sale.date.split("T")[0]);
          return soldDates.includes(todayDateString);
        });

        let formattedData = filteredProducts.map((product, index) => {
          const todaySales = product.soldAt.filter((sale) => sale.date.split("T")[0] === todayDateString);

          const soldHistory = [
            product.soldAt
              ? product.soldAt.map((sale) => ({
                  type: "sold",
                  quantity: sale.quantity,
                  date: convertirFormatDate(sale.date),
                }))
              : []
          ];
          
          const restockHistory = [
            product.restockAt
              ? product.restockAt.map((restock) => ({
                  type: "restock",
                  quantity: restock.quantity,
                  date: convertirFormatDate(restock.date),
                }))
              : []
          ];

        const historyExtended = soldHistory.concat(restockHistory).flat()
        .sort((a, b) => {
          const dateA = a.date.split('/').reverse().join('');
          const dateB = b.date.split('/').reverse().join('');
          return parseInt(dateB) - parseInt(dateA);
        })

        const history = [];
          for (let i = 0; i < historyExtended.length; i++) {
            let found = false;

            for (let j = 0; j < history.length; j++) {
              if (historyExtended[i].type === history[j].type && historyExtended[i].date === history[j].date) {
                history[j].quantity += historyExtended[i].quantity;
                found = true;
                break;
              }
            }

            if (!found) {
              history.push(historyExtended[i] );
            }
          }

          return {
            key: index,
            product: product.name,
            category: product.category[0]?.name || "N/A",
            date: todayDateString,
            stock: product.stock,
            quantitySold: todaySales.reduce(
              (total, sale) => total + sale.quantity,
              0
            ),
            sales: todaySales.length,
            history: history,
          };
        });
       
        setDisplayProducts(formattedData);
     
        
      });
    } else if (filter == 'This week') {

      const { startDateString, endDateString } = calculateWeekRange();

    fetch("http://localhost:3000/products/allProducts")
    .then((response) => response.json())
    .then((data) => {
      let filteredProducts = data.allProducts.filter((product) => {
        let soldDates = product.soldAt.map((sale) => sale.date.split("T")[0]);
        return soldDates.some(date => date >= startDateString && date <= endDateString);
      });

      let formattedData = filteredProducts.map((product, index) => {
        const weekSales = product.soldAt.filter((sale) => {
          const saleDate = sale.date.split("T")[0];
          return saleDate >= startDateString && saleDate <= endDateString;
        });
        
        const soldHistory = [
          product.soldAt
            ? product.soldAt.map((sale) => ({
                type: "sold",
                quantity: sale.quantity,
                date: convertirFormatDate(sale.date),
              }))
            : []
        ];
        
        const restockHistory = [
          product.restockAt
            ? product.restockAt.map((restock) => ({
                type: "restock",
                quantity: restock.quantity,
                date: convertirFormatDate(restock.date),
              }))
            : []
        ];

      const historyExtended = soldHistory.concat(restockHistory).flat()
      .sort((a, b) => {
        const dateA = a.date.split('/').reverse().join('');
        const dateB = b.date.split('/').reverse().join('');
        return parseInt(dateB) - parseInt(dateA);
      })

      const history = [];
      for (let i = 0; i < historyExtended.length; i++) {
        let found = false;

        for (let j = 0; j < history.length; j++) {
          if (historyExtended[i].type === history[j].type && historyExtended[i].date === history[j].date) {
            history[j].quantity += historyExtended[i].quantity;
            found = true;
            break;
          }
        }

        if (!found) {
          history.push(historyExtended[i] );
        }
      }      

        return {
          key: index,
          product: product.name,
          category: product.category[0]?.name || "N/A",
          date: startDateString + " to " + endDateString,
          stock: product.stock,
          quantitySold: weekSales.reduce((total, sale) => total + sale.quantity, 0),
          sales: weekSales.length,
          history: history,
        };
      });

      setDisplayProducts(formattedData);
    });
    }

  }, [refresh, filter]);



  const tableStyle = {
    backgroundColor: "#213F62",
    border: "2px solid #000",
  };

  const handleAddStockButtonClick = () => {
    setOpenAddStockModal(true);
  };

  const handleSaleButtonClick = () => {
    setSaleModal(true);
  };

  const handleCloseButton = () => {
    setOpenAddStockModal(false);
    setSaleModal(false);
  };


  /* Statisitcs Graph Chart */

  const [timeFilter, setTimeFilter] = useState("day");
  const [chartData, setChartData] = useState([]);
  const [yAxisLegend, setYAxisLegend] = useState('');
  const [categoryState, setCategoryState] = useState({
    category: [],
    categoryId: "all",
  });
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFilterDateChange = (filter) => {
    setFilter(filter);
  };

  // Function to handle changes in time selection in graph
  const handleTimeSelectChange = (event) => {
    setTimeFilter(event.target.value);
  };


// Fetch data from the server
useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch all categories
      const responseCategories = await fetch(
        "http://localhost:3000/categories/allCategories"
      );
      const dataCategories = await responseCategories.json();
      // Update the category state with the fetched categories
      setCategoryState((prevState) => ({
        ...prevState,
        category: dataCategories.allCategories,
      }));

      // Fetch all products
      const responseProducts = await fetch(
        "http://localhost:3000/products/allProducts"
      );
      const dataProducts = await responseProducts.json();

      // Filter products based on selected category
      let filteredProducts;
      if (categoryState.categoryId === "all") {
        filteredProducts = dataProducts.allProducts;
      } else {
        filteredProducts = dataProducts.allProducts.filter((product) =>
          product.category.some(
            (category) => category._id === categoryState.categoryId
          )
        );
      }

      // Transform data for selling chart
      const transformedDataSell = transformDataSell(
        filteredProducts,
        filter,
        timeFilter
      );
      setChartData({ ...transformedDataSell });

      setDataLoaded(true); // Data has been loaded
    } catch (error) {
      console.error(error);

  
    }
  };

  fetchData();
  // This effect runs when 'filter', 'categoryState.categoryId', or 'timeFilter' changes
}, [filter, categoryState.categoryId, timeFilter]);

useEffect(() => {
  fetch("http://localhost:3000/products/allProducts")
    .then((response) => response.json())
    .then((data) => {
      setProducts(data.allProducts);
      if (data.allProducts && data.allProducts.length > 0) {
        setSelectedProduct(data.allProducts[0]._id);
      }
    });
}, []);


// State pour l'option de légende


// Bar chart component
function BarChart({ chartData, yAxisLegend }) {
  // If there are no labels, return a message
  if (chartData && chartData.datasets) {
    return (
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: yAxisLegend, // Utilisation de la prop pour la légende de l'axe Y
              },
            },
          },
        }}
      />
    );
  } else {
    return <p>No data available for the chart.</p>;
  }
}

  return (
    <main className={styles.main}>
      <h1>Welcome {user.username}</h1>
      <div className={styles.productButton}>
        <button
          className={styles.addProduct}
          onClick={handleAddStockButtonClick}
        >
          Add stock
        </button>

        <button className={styles.saleProduct} onClick={handleSaleButtonClick}>
          Sale Products
        </button>
        <FilterDate handleFilterDateChange={handleFilterDateChange} />
      </div>
      <div className={styles.leftSection}>
        <div className={styles.sale}>
          <div className={styles.sales}>
            <div className={styles.tableContainer}>
              <Table
                className={styles.Table}
                dataSource={displayProducts}
                columns={columns}
                pagination={{ pageSize: 10 }}
                size="large"
                style={tableStyle}
                expandable={{
                  expandedRowRender: (record) => {  
                  return (
                    <ul>
                    <div style={{ maxHeight: '20rem', overflowY: 'auto' }}>
                      {record.history.map((operationGroup, groupIndex) => (
                        <li key={groupIndex}>
                              {operationGroup.type && operationGroup.quantity && operationGroup.date
                                ? `${operationGroup.date.split(' ')[0]}: ${operationGroup.quantity} ${operationGroup.type}`
                                : ""} 
                        </li>
                      ))}
                    </div>
                  </ul>
                  )},
                  rowExpandable: (record) => record.history.length > 0,
                }}
              />
            </div>
          </div>
        </div>
                {/* GRAPH SECTION */}
        <div>
          <div className={styles.filterContainer}>
            <div className={styles.filterArea}>
              <div className={styles.filterByTemp}>
                <p>Filter by Temps</p>
                <select onChange={handleTimeSelectChange}>
                  <option value="day">Par Jour</option>
                  <option value="week">Par Semaine</option>
                  <option value="month">Par Mois</option>
                </select>
              </div>
              <div className={styles.filterByObject}>
                <p>Filter by Object</p>
                <select onChange={(e) => setFilter(e.target.value)}>
                  <option value="categories">Catégories</option>
                  <option value="products">Produits</option>
                </select>
              </div>
            </div>
          </div>
          <div className={styles.firstChart}>
            <h2>Sales Statistics</h2>
            
              <BarChart
              className={styles.firstChartCl}
              chartData={chartData}
              yAxisLegend={yAxisLegend} // Prop pour l'option de légende
            />        
        
          </div>
        </div>
                  {/* END GRAPH SECTION */}

      </div>
      
      <div className={styles.rightSection}>

                {/* NATHAN VA TRAVAILLER ICI */}

      </div>
      {openAddStockModal && (
        <AddStock
          openAddStockModal={openAddStockModal}
          handleCloseButton={handleCloseButton}
          refreshLastSale={refreshLastSale}
          refresh={refresh}
        />
      )}
      {openSaleModal && (
        <Sale
          openSaleModal={openSaleModal}
          handleCloseButton={handleCloseButton}
          refreshLastSale={refreshLastSale}
        />
      )}
    </main>
  );
}

export default Home;
