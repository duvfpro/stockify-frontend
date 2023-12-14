import styles from '../styles/ProductsPage.module.css';
import AddNewProduct from './AddNewProduct';
import Product from './Product';
import { Modal } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function ProductsPage(props) {

  const [myProducts, setMyProducts] = useState([]);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false); // recharge les produits après suppression d'un produit
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [productName, setProductName] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);
  
  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  const [nameToSave, setNameToSave] = useState('');

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);
  
  useEffect(() => { // Affiche la liste de tous nos produits
    setTimeout(() => {
       fetch('http://localhost:3000/products/allProducts')
      .then(response => response.json())
      .then(data => {
        setMyProducts(data.allProducts);
      });
    }, 500);
  }, [refreshProducts]);


  useEffect(() => { // fetch toutes les catégories pour le menu déroulant de la modal
    fetch('http://localhost:3000/categories/allCategories')
    .then(response => response.json())
    .then(data => {
        let categories = [];
        for (let i=0; i<data.allCategories.length; i++) {
            categories.push({name: data.allCategories[i].name, _id: data.allCategories[i]._id})
        };
        setCategory(categories);
        setCategoryId(categories[0]._id); // sert à récupérer l'id de la première catégorie pour l'afficher en premier dans le menu
        //(cas de figure ou le user choisi la première catégorie sans touche le menu déroulant)
    });
}, []);



    const handleAddProductButton = () => {
      setOpenAddProductModal(true);
    };
  
    const handleCloseButton = () => {
      setOpenAddProductModal(false);
      setRefreshProducts(!refreshProducts);
    }; 

    const handleDeleteButton = (name) => {
      fetch(`http://localhost:3000/products/deleteProduct/${name}`, {
        method: 'DELETE',
			  headers: { 'Content-Type': 'application/json' },
      })
      .then(data => {
        setRefreshProducts(!refreshProducts);
      })
    };

    const handleEditButton = (name, price) => {
      setNameToSave(name);
      setOpenEditModal(true);
      setProductName(name);
      setPrice(price);
    };

    const closeEditModal = () => {
      setOpenEditModal(false);
    };

    const handleNameInputChange = (event) => {
      setProductName(event.target.value);
    };

    const handleSelectChange = (event) => { // Gère le choix de la catégorie et cherche son ID
      let catName = event.target.value;
      let id=category.find(element => element.name === catName)
      setCategoryId(id._id);
      setCategoryName(catName);
    };

    const handlePriceInputChange = (event) => {
      const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

      if (isValidInput) {
          setPrice(event.target.value);
      };
  };

    const handleSaveButton = () => { 
      fetch(`http://localhost:3000/products/updateMyProduct/${nameToSave}`, {
        method: 'PUT',
			  headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: productName, category: categoryId, price: price })
      });
      setRefreshProducts(!refreshProducts);
      setOpenEditModal(false);
  };


    return (
        <div className={styles.main}>
            <h1>ProductsPage</h1>
            <button className={styles.addProduct} onClick={() => handleAddProductButton() }> ADD NEW PRODUCT </button>
            {openAddProductModal && 
              <AddNewProduct openAddProductModal={openAddProductModal} handleCloseButton={handleCloseButton} /> }
            {myProducts.map((data, i) => {
              // return <Product key={i} name={data.name} stock={data.stock} category={data.category[0].name} handleDeleteButton={handleDeleteButton} />
              return <Product key={i} name={data.name} stock={data.stock} price={data.price} handleDeleteButton={handleDeleteButton} handleEditButton={handleEditButton} />
              })}

        <Modal open={openEditModal} onCancel={closeEditModal} footer={null} width={800} height={800}>
            <div className={styles.title} > UPDATE PRODUCT </div>
            <div className={styles.mainContainer}>
              <input type="text" onChange={handleNameInputChange} value={productName} placeholder="Product name" />
              <select onChange={handleSelectChange} >
                {category.map((data, index) => (
                <option key={index} value={data.name}> {data.name} </option>
                ))}
              </select>
              <input type="number" onChange={handlePriceInputChange} value={price} placeholder="Price" required />
              <button onClick={() => handleSaveButton()} > SUBMIT </button>
            </div>
        </Modal>
        </div>
    )

};


export default ProductsPage;