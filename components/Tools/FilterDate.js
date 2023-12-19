import React, { useEffect, useState } from "react";
import { Select } from "antd";
import styles from "../../styles/FilterDate.module.css";



const FilterDate = (props) => {
  const [selectedFilter, setSelectedFilter] = useState('');


  const handleFilterDateChange = (selectedFilter) => {
    setSelectedFilter(selectedFilter);
    props.handleFilterDateChange(selectedFilter);
  };

  return (
    <div className={styles.filter}>
      <Select
      placeholder="Filter by Date"
      options={[{value: "Today"}, {value: "This week"}]}
      onChange={handleFilterDateChange}
      defaultValue={"Today"}
    />
    </div>
    
  );
};

export default FilterDate;
