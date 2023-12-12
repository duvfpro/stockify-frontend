import styles from '../styles/ProductsPage.module.css';
import AddNewProduct from './AddNewProduct';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function ProductsPage(props) {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);

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