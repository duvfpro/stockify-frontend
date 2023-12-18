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
    <div className={styles.filter}>
      <Select
      placeholder="Filter by stock"
      // value="Filter by Stock"
      options={[{value: "Ascending"}, {value: "Descending"}]}
      onChange={handleStockFilterChange}
    //   class="ant-select-selection-placeholder"
    />
    </div>
    
  );
};

export default Filter;
