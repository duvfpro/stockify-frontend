import React, { useEffect, useState } from "react";
import { Select } from "antd";
import styles from "../../styles/FilterStock.module.css";



const Filter = (props) => {
  const [selectedItems, setSelectedItems] = useState('');


  const handleStockFilterChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    props.handleStockFilterChange(selectedItems);
  };

  return (
      <Select
      placeholder="Filter by stock"
      options={[{value: "Stock Ascending"}, {value: "Stock Descending"}, {value: "No Stock Filter"}]}
      onChange={handleStockFilterChange}
      style={{ width: '10rem' }}
    />
    
  );
};

export default Filter;
