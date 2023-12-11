import React from 'react';
import { Table } from 'antd';

const columns = [
    {
      title: 'Product',
      width: 120,
      dataIndex: 'product',
      name: 'product',
    },
    {
      title: 'Date',
      width: 120,
      dataIndex: 'date',
      sorter: true,
    },
    {
      title: 'Stock left',
      dataIndex: 'stock',
      width: 120,
    },
    {
        title: 'Number of sales',
        dataIndex: 'sales',
        width: 120,
      },
  ];

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

    fetch('http://localhost:3000/allProducts')
    .then(response => response.json())
    .then(data => {
        const date = new Date();
        console.log(data.soldAt);
        data.filter(products => products.soldAt.date.includes(date))
    })
  ];




function LastSales () {

    return (
        <Table dataSource={dataTest} columns={columns} />
    )
};

export default LastSales;