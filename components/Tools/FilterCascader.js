import React, { useEffect, useState } from "react";
import { Select } from "antd";
import styles from "../../styles/FilterCascader.module.css";


const FilterCascader = (props) => {
  const [categoriesTab, setCatgoriesTab] = useState([]);
  const [categoriesTabObject, setCategoriersTabObject] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);


  useEffect(() => {
    fetch("http://localhost:3000/categories/allCategories")
      .then((response) => response.json())
      .then((data) => {
        let categories = [];
        let categoriesTabObject = [];
        for (let i = 0; i < data.allCategories.length; i++) {
          categories.push(data.allCategories[i].name);
          categoriesTabObject.push(data.allCategories[i]);
        }
        setCatgoriesTab(categories);
        setCategoriersTabObject(categoriesTabObject);
      });
  }, []);

  const filteredOptions = categoriesTab.filter(
    (e) => !selectedItems.includes(e)
  );

  const handleFilterChange = (selectedItems) => {
    setSelectedItems(selectedItems);
    props.handleFilterChange(selectedItems);
  };

  return (
    <div className={styles.filter}>
      <Select
      mode="multiple"
      placeholder="Filter by category"
      value={selectedItems}
      onChange={handleFilterChange}
      options={filteredOptions.map((item) => ({ value: item, label: item }))}
      // class="ant-select-selection-placeholder"
    />
    </div>
    
  );
};

export default FilterCascader;
