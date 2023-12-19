// import React, { useEffect, useState } from "react";
// import { Table } from "antd";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/router";
// import styles from "../styles/LastSales.module.css";

// function LastSales({refresh}) {
//   const [displayProducts, setDisplayProducts] = useState([]);
//   const user = useSelector((state) => state.user.value);
//   const router = useRouter();
 

  

//   useEffect(() => {
//     if (!user.token) {
//       router.push("/");
//     }
//   }, [user.token, router]);
 

//   const columns = [
//     // Schema du tableau
//     {
//       title: "Product",
//       width: 120,
//       dataIndex: "product",
//       sorter: true,
//     },
//     {
//       title: "Category",
//       width: 120,
//       dataIndex: "category",
//       sorter: true,
//     },
//     {
//       title: "Date",
//       width: 120,
//       dataIndex: "date",
//     },
//     {
//       title: "current Stock ",
//       dataIndex: "stock",
//       width: 120,
//       sorter: true,
//     },
//     {
//       title: "Number of sales",
//       dataIndex: "sales",
//       width: 120,
//       sorter: true,
//     },
//     {
//       title: "Quantity Sold",
//       dataIndex: "quantitySold",
//       width: 120,
//       sorter: true,
//     },
//   ];

//   useEffect(() => {
//     // Affiche la liste des produits vendus aujourd'hui
//     console.log("LastSales useEffect triggered");
//     fetch("http://localhost:3000/products/allProducts")
//       .then((response) => response.json())
//       .then((data) => {
//         console.log(data.allProducts);

//         const currentDate = new Date();
//         const date = currentDate.getDate().toString().padStart(2, "0");
//         const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
//         const year = currentDate.getFullYear().toString();

//         const todayDateString = `${year}-${month}-${date}`;
//         // console.log(todayDateString)

//         let filteredProducts = data.allProducts.filter((product) => {
//           let soldDates = product.soldAt.map((sale) => sale.date.split("T")[0]);
//           console.log(soldDates);
//           return soldDates.includes(todayDateString);
//         });

//         let formattedData = filteredProducts.map((product,index) => {

//           const history = [
//             ...product.soldAt.map((sale) => ({
//               type: "vendu le",
//               quantity: sale.quantity,
//               date: new Date(sale.date).toLocaleString(),
//             })),
//             ...product.restockAt.map((restock) => ({
//               type: "restock le",
//               quantity: restock.quantity,
//               date: new Date(restock.date).toLocaleString(),
//             })),
//           ];
  
//           return {
//             key: index,
//             product: product.name,
//             category: product.category[0]?.name || "N/A",
//             date: todayDateString,
//             stock: product.stock,
//             quantitySold: product.soldAt.reduce(
//               (total, sale) => total + sale.quantity,
//               0
//             ),
//             sales: product.soldAt.length,
//             history: history,
//           };
        
//         });
        
//         // console.log(formattedData);
//         setDisplayProducts(formattedData);
//       });
//   }, [refresh]);
//   const tableStyle = {
   
//     backgroundColor: '#213F62',
//     border: '2px solid #000',
    
//   };


//   return (
//     <div className={styles.sales}>
//       <div className={styles.tableContainer}>
//         <Table
//           className={styles.Table}
//           dataSource={displayProducts}
//           columns={columns}
//           pagination={{ pageSize: 10 }}
//           size="large"
//           style={tableStyle}
//           expandable={{
//             expandedRowRender: (record) => (
//               <ul>
//                 {record.history.map((operation, index) => (
//                   <li key={index}>
//                     {`${operation.type} ${operation.quantity} on ${operation.date}`}
//                   </li>
//                 ))}
//               </ul>
//             ),
//             rowExpandable: (record) => record.history.length > 0,
//           }}
//         />
//       </div>
//     </div>
//   );
// }

// export default LastSales;
