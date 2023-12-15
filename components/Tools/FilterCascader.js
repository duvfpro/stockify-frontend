import React, {useEffect, useState} from 'react';
import { Cascader } from 'antd';
import { Select } from 'antd';

const FilterCascader = () => {
    
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
const [categoriesTab, setCatgoriesTab] = useState([]);
const [selectedItems, setSelectedItems] = useState([]);

useEffect(() => {
       fetch('http://localhost:3000/categories/allCategories')
        .then(response => response.json())
        .then(data => {
            let categories=[]
        for(let i=0; i<data.allCategories.length; i++) {
            categories.push(data.allCategories[i].name)
        }
        setCatgoriesTab(categories);
        console.log(categoriesTab);
        })
}, []);

const filteredOptions = categoriesTab.filter((o) => !selectedItems.includes(o));




return (

    <Select
    mode="multiple"
    placeholder="Filter by category"
    value={selectedItems}
    onChange={setSelectedItems}
    style={{
      width: '100%',
    }}
    options={filteredOptions.map((item) => ({
      value: item,
      label: item,
    }))}
  />

)

};


export default FilterCascader;