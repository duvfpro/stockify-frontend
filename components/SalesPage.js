import styles from "../styles/SalesPage.module.css";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Table } from "antd";


function SalesPage() {
  const router = useRouter();
  const user = useSelector((state) => state.user.value);
  const [displayProducts, setDisplayProducts] = useState([]);


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

  useEffect(() => {
    // Affiche la liste des produits vendus aujourd'hui

    fetch("http://localhost:3000/products/allProducts")
      .then((response) => response.json())
      .then((data) => {

        const currentDate = new Date();
        const date = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear().toString();

        const todayDateString = `${year}-${month}-${date}`;

        let filteredProducts = data.allProducts.filter((product) => {
          let soldDates = product.soldAt.map((sale) => sale.date.split("T")[0]);
          return soldDates.includes(todayDateString);
        });

        let formattedData = filteredProducts.map((product, index) => {
          const history = [
            product.soldAt
              ? product.soldAt.map((sale) => ({
                  type: "vendu ",
                  quantity: sale.quantity,
                  date: new Date(sale.date).toLocaleString(),
                }))
              : [],
            product.restockAt
              ? product.restockAt.map((restock) => ({
                  type: "restock ",
                  quantity: restock.quantity,
                  date: new Date(restock.date).toLocaleString(),
                }))
              : [],
          ];

          return {
            key: index,
            product: product.name,
            category: product.category[0]?.name || "N/A",
            date: todayDateString,
            stock: product.stock,
            quantitySold: product.soldAt.reduce(
              (total, sale) => total + sale.quantity,
              0
            ),
            sales: product.soldAt.length,
            history: history,
          };
        });
       
        
        setDisplayProducts(formattedData);
     
        
      });
  }, []);

  
const handleSorterChange = () => {

}
  

  const tableStyle = {
    backgroundColor: "#213F62",
    border: "2px solid #000",
  };

  return (
    <div className={styles.main}>
      <div className={styles.sales}>
        <Table
          dataSource={displayProducts} 
          columns={columns} 
          pagination={{ pageSize: 10 }}
          size="large"
          style={tableStyle}
          expandable={{
            expandedRowRender: (record) => (
              <ul>
                {record.history.map((operationGroup, groupIndex) => (
                  <li key={groupIndex}>
                    {operationGroup.map((operation, operationIndex) => (
                      <p key={operationIndex}>
                        {operation.type && operation.quantity && operation.date
                          ? `${operation.type} ${operation.quantity} le ${operation.date}`
                          : "Invalid operation data"}
                      </p>
                    ))}
                  </li>
                ))}
              </ul>
            ),
            rowExpandable: (record) => record.history.length > 0,
          }}
          onChange={handleSorterChange}
        />
      </div>
    </div>
  );
}

export default SalesPage;
