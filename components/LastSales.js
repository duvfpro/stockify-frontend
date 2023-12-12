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
            const date = new Date().getDate().toString();
            console.log(date)
            let filtre = data.allProducts.filter((products) => {
            let sold = products.soldAt;
            console.log(sold)
            let soldToday = sold.some(e => (e.date.charAt(5)+e.date.charAt(6)) === date)
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