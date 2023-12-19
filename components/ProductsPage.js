import styles from '../styles/ProductsPage.module.css';
import AddNewProduct from './AddNewProduct';
import Product from './Product';
import FilterCascader from './Tools/FilterCascader';
import FilterStock from './Tools/FilterStock';
import { Modal, Button } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function ProductsPage(props) {

  const [myProducts, setMyProducts] = useState([]);
  const [openAddProductModal, setOpenAddProductModal] = useState(false);
  const [refreshProducts, setRefreshProducts] = useState(false); // recharge les produits après suppression d'un produit
  const [category, setCategory] = useState([]);
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(null);
  const [image, setImage] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');

  const [productName, setProductName] = useState('');
  const [openEditModal, setOpenEditModal] = useState(false);

  const [selectedFilters, setSelectedFilters] = useState([]); // pour stocker les filtres
  const [selectedStockFilters, setSelectedStockFilters] = useState(''); // pour stocker les filtres stock

  const [triggerSortByStock, setTriggerSortByStock] = useState(false);

  const user = useSelector((state) => state.user.value);
  const router = useRouter();

  const [nameToSave, setNameToSave] = useState('');

  console.log(selectedFilters)

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setTimeout(async () => {
        const response = await fetch('http://localhost:3000/products/allProducts');
        const data = await response.json();
        let productTab = [];
        for(let i=0; i<selectedFilters.length; i++ ) {
          for(let j=0; j<data.allProducts.length; j++) {
            if(selectedFilters[i] == data.allProducts[j].category[0].name) {
              productTab.push(data.allProducts[j]);
            }
          }
        }
        if(JSON.stringify(productTab) === JSON.stringify([])) { // = s'il ny a pas de filtre
          if(triggerSortByStock == "Stock Ascending") { // = si le bouton trie par stock est activé
            setMyProducts(data.allProducts.sort(compareByStock));
          } else if(triggerSortByStock == "Stock Descending") {
            setMyProducts(data.allProducts.sort(compareByStock).reverse());
          } else {
            setMyProducts(data.allProducts);
          }
        } else {
          if(triggerSortByStock == "Stock Ascending") { // = si le bouton trie par stock est activé
            setMyProducts(productTab.sort(compareByStock));
          } else if(triggerSortByStock == "Stock Descending") {
            setMyProducts(productTab.sort(compareByStock).reverse());
          } else {
            setMyProducts(productTab);
          }     
        }
        }, 1000)

      } catch (error) {
        console.error('Erreur lors de la récupération des produits :', error);
      }
    };
    fetchData();
  }, [refreshProducts, selectedFilters, triggerSortByStock]);
  

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

function compareByStock(a, b) {
  if (a.stock < b.stock) {
    return -1;
  }
  if (a.stock > b.stock) {
    return 1;
  }
  return 0;
}

const handleTriStockButton = () => {
  setTriggerSortByStock(!triggerSortByStock);
  // productsArray.sort(compareByStock);
};

  
const handleCloseButton = () => {
  setOpenAddProductModal(false);
  setRefreshProducts(!refreshProducts);
}; 

const handleDeleteButton = (name) => {
  const isConfirmed = window.confirm('Are you sure you want to delete this user?');
  if(isConfirmed) {
    fetch(`http://localhost:3000/products/deleteProduct/${name}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(data => {
      setRefreshProducts(!refreshProducts);
    })    
  }
};

const handleEditButton = (name, price, category, stock, image) => {
  setNameToSave(name);
  setOpenEditModal(true);
  setProductName(name);
  setPrice(price);
  setStock(stock);
  setImage(image);
  console.log(image);
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

const handleStockInputChange = (event) => {
  const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

  if (isValidInput) {
      setStock(event.target.value);
  };
};

const handleImageInputChange = (e) => {
  const file = e.target.files[0];
  setImage(file);
};


const handleSaveButton = () => {
 
  fetch(`http://localhost:3000/products/updateMyProduct/${nameToSave}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: productName, category: categoryId, price: price, stock: stock })
  });
  setRefreshProducts(!refreshProducts);
  setOpenEditModal(false);
  };


  const handleFilterChange = (selectedFilters) => {
    setSelectedFilters(selectedFilters);
  }

  const handleStockFilterChange = (stockFilterChange) => {
    setTriggerSortByStock(stockFilterChange);

    // setTriggerSortByStock(!triggerSortByStock);
    // setSelectedStockFilters(selectedFilters)
  }


    return (
      <div className={styles.main}>
        <div className={styles.filtersContainer}>
          <div className={styles.myFilters}>
            <FilterCascader handleFilterChange={handleFilterChange} />
            <FilterStock handleStockFilterChange={handleStockFilterChange} />
          </div>
          
          {/* <Button type="primary" onClick={() => handleTriStockButton()} className={styles.addProductButton} > Tri stock croissant </Button> */}
          <button className={styles.addProduct} onClick={() => handleAddProductButton() }> ADD NEW PRODUCT </button>
        </div>

            <div className={styles.productCards}>
              {openAddProductModal && 
                <AddNewProduct openAddProductModal={openAddProductModal} handleCloseButton={handleCloseButton} /> }
              {myProducts.map((data, i) => {
                return <Product key={i} name={data.name} stock={data.stock} price={data.price} category={data.category[0].name} image={data.image} handleDeleteButton={handleDeleteButton} handleEditButton={handleEditButton} />
              })}
            </div>

          <Modal className={styles.modalMainContent} open={openEditModal} onCancel={closeEditModal} footer={null} width={800} height={800}>
              <div className={styles.modalMainContent}>
                <img src={image} alt={productName} />
              <div className={styles.title} > UPDATE PRODUCT </div>
              <div className={styles.mainContainer}>
                <div>
                   NAME <input className={styles.inputField} type="text" onChange={handleNameInputChange} value={productName} placeholder="Product name" />
                </div>
                <div>
                  PRICE <input className={styles.inputField} type="number" onChange={handlePriceInputChange} value={price} placeholder="Price" required />
                </div>
                <div>
                  STOCK <input className={styles.inputField} type="number" onChange={handleStockInputChange} value={stock} placeholder="Stock" required />
                </div>
                <div>
                  CATEGORY <select className={styles.inputField} onChange={handleSelectChange} >
                  {category.map((data, index) => (
                  <option key={index} value={data.name}> {data.name} </option>
                  ))}
                  </select>
                </div>
                <button onClick={() => handleSaveButton()} > SUBMIT </button>
              </div>
              </div>
              
              
          </Modal>
      </div>
)
};

export default ProductsPage;