import React, { useEffect, useState } from 'react';
import { Table } from 'antd';


  const dataTest = [
    // {
    //     key: 'table',
    //     product: 'Table',
    //     date: "10/12/2023",
    //     stock: 23,
    //     sales: 5,
    // },
    // {
    //     key: 'chaise',
    //     product: 'chaise',
    //     date: "08/12/2023",
    //     stock: 13,
    //     sales: 2,
    // },

  ];



function LastSales () {

    const [displayProducts, setDisplayProducts] = useState([])

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
            const date = new Date();
            let filtre = data.allProducts.filter((products) => {
            let sold = products.soldAt;
            let soldToday = sold.some(e => e.date === date)
            return soldToday;
        });
        setDisplayProducts(filtre);
    })
    }, []);
    console.log(displayProducts)


    return (
        <Table dataSource={displayProducts} columns={columns} />
    )
};

export default LastSales;