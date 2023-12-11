import styles from '../styles/Home.module.css';
import LastSales from './LastSales';
import AddStock from './AddStock';
import React, { useState } from 'react';


function Home() {

  const [openAddStockModal, setOpenAddStockModal] = useState(false);

  
  const handleAddStockButton = () => {
    setOpenAddStockModal(true);
  }

  const handleCloseButton = () => {
    setOpenAddStockModal(false);
  }


  return (
    <main className={styles.main} >
      <h1>Welcome</h1>
      <button className={styles.addProduct} onClick={() => handleAddStockButton() }> ADD STOCK </button>
      <LastSales />
      {openAddStockModal && <AddStock openAddStockModal={openAddStockModal} handleCloseButton={handleCloseButton} /> }
    </main>
  )

}

export default Home;