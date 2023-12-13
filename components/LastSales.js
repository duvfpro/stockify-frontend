import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';


function LastSales () {

    const [displayProducts, setDisplayProducts] = useState([])
    const user = useSelector((state) => state.user.value);
    const router = useRouter();

    useEffect(() => {
      if (!user.token) {
        router.push('/');
      }
    }, [user.token, router]);

    const columns = [  // Schema du tableau
        {
          title: 'Product',
          width: 120,
          dataIndex: 'product',
          sorter: true,
        },
        {
            title: 'Category',
            width: 120,
            dataIndex: 'category',
            sorter: true,
          },
        {
          title: 'Date',
          width: 120,
          dataIndex: 'date',
        },
        {
          title: 'Stock left',
          dataIndex: 'stock',
          width: 120,
          sorter: true,
        },
        {
            title: 'Number of sales',
            dataIndex: 'sales',
            width: 120,
            sorter: true,
          },
      ];
    

    useEffect(() => { // Affiche la liste des produits vendus aujourd'hui
        fetch('http://localhost:3000/products/allProducts')
        .then(response => response.json())
        .then(data => {
          console.log(data.allProducts)

          const currentDate = new Date();
          const date = currentDate.getDate().toString().padStart(2, '0');
          const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
          const year = currentDate.getFullYear().toString();
  
          const todayDateString = `${year}-${month}-${date}`;
          // console.log(todayDateString)
  
          let filteredProducts = data.allProducts.filter(product => {
            let soldDates = product.soldAt.map(sale => sale.date);
            console.log(soldDates)
            return soldDates.includes(todayDateString);
          });
  
        console.log(filteredProducts)
        setDisplayProducts(filteredProducts);
    })
    }, []);

    

    return (
        <Table dataSource={displayProducts} columns={columns} />
    )
};

export default LastSales;