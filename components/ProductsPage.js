import styles from '../styles/ProductsPage.module.css';
import AddNewProduct from './AddNewProduct';
import Product from './Product';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function ProductsPage(props) {

  const [myProducts, setMyProducts] = useState([]);
  const [refreshProducts, setRefreshProducts] = useState(false); // recharge les produits après suppression d'un produit

  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);
  
  useEffect(() => { // Affiche la liste de tous nos produits
    fetch('http://localhost:3000/products/allProducts')
    .then(response => response.json())
    .then(data => {
      setMyProducts(data.allProducts);
    });
  }, [refreshProducts]);

    const [openAddProductModal, setOpenAddProductModal] = useState(false);

    const handleAddProductButton = () => {
      setOpenAddProductModal(true);
    };
  
    const handleCloseButton = () => {
      setOpenAddProductModal(false);
      setRefreshProducts(!refreshProducts); // c'est sensé rechargé les products mais non...
    }; 

    const handleDeleteButton = (name) => {
      fetch(`http://localhost:3000/products/deleteProduct/${name}`, {
        method: 'DELETE',
			  headers: { 'Content-Type': 'application/json' },
      })
      .then(data => {
        setRefreshProducts(!refreshProducts);
      })
    }


    return (
        <div className={styles.main}>
            <h1>ProductsPage</h1>
            <button className={styles.addProduct} onClick={() => handleAddProductButton() }> ADD NEW PRODUCT </button>
            {openAddProductModal && 
              <AddNewProduct openAddProductModal={openAddProductModal} handleCloseButton={handleCloseButton} /> }
            {myProducts.map((data, i) => {
              return <Product key={i} name={data.name} stock={data.stock} category={data.category[0].name} handleDeleteButton={handleDeleteButton} />
              })}
        </div>
    )

};


export default ProductsPage;