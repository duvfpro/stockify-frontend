import styles from '../styles/ProductsPage.module.css';
import AddNewProduct from './AddNewProduct';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';



function ProductsPage(props) {

    const [openAddProductModal, setOpenAddProductModal] = useState(false);

    const handleAddProductButton = () => {
      setOpenAddProductModal(true);
    };
  
    const handleCloseButton = () => {
      setOpenAddProductModal(false);
    };


    return (
        <div className={styles.main}>
            <h1>ProductsPage</h1>
            <button className={styles.addProduct} onClick={() => handleAddProductButton() }> ADD NEW PRODUCT </button>
            {openAddProductModal && <AddNewProduct openAddProductModal={openAddProductModal} handleCloseButton={handleCloseButton} /> }
        </div>
    )

};


export default ProductsPage;