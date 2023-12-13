import styles from '../styles/AddNewProduct.module.css';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';


function AddNewProduct(props) {

    const [productName, setProductName] = useState('');
    const [productStock, setProductStock] = useState(0);
    const [productImage, setProductImage] = useState(null);
    const [category, setCategory] = useState([]);
    const [categotyId, setCategoryId] = useState('');
    const [selectedOption, setSelectedOption] = useState(''); // Stock le choix de la catégorie


    useEffect(() => { // fetch toutes les catégories pour le menu déroulant de la modal
        fetch('http://localhost:3000/categories/allCategories')
        .then(response => response.json())
        .then(data => {
            let categories = [];
            for (let i=0; i<data.allCategories.length; i++) {
                categories.push(data.allCategories[i].name)
            };
            setCategory(categories);
        });
    }, []);


    const handleCancel = () => { // Ferme la modal
        setIsOpen(false);
    };

    const handleSubmitButton = () => { // Manque à pouvoir ajouter du stock à la création et une IMAGE
        fetch('http://localhost:3000/products/newProduct', {
            method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: productName, image: productImage, stock: 0, category: categotyId }),
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    };

    const handleNameInputChange = (event) => {
        setProductName(event.target.value);
    };
    const handleStockInputChange = (event) => {
        // Vérifie que c'est bien un nombre
        const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

        if (isValidInput) {
            setProductStock(event.target.value);
        }
    };

    const handleImageInputChange = (e) => {
        const file = e.target.files[0];
        console.log(e.target.file)
        setProductImage(file);
    };

    const handleSelectChange = (event) => { // Gère le choix de la catégorie et cherche son ID
        let catName = event.target.value;
        setSelectedOption(event.target.value)
        fetch(`http://localhost:3000/categories/getId/${catName}`)
        .then(response => response.json())
        .then(data => {
            setCategoryId(data.categoryId)
            // console.log(data.categoryId);
        })
    };


    return (
        <Modal open={props.openAddProductModal} onCancel={props.handleCloseButton} footer={null} width={800} height={800}>
            <div className={styles.title} > ADD NEW PRODUCT </div>
                <div className={styles.mainContainer}>
                    <input type="text" onChange={handleNameInputChange} value={productName} placeholder="Product name" required />
                    {/* <input type="number" onChange={handleStockInputChange} value={productStock} placeholder="Stock" required /> */}
                    <input type="file" onChange={handleImageInputChange} accept="image/*" />
                    <select onChange={handleSelectChange} >
                        {category.map((data, index) => (
                        <option key={index} value={data}> {data} </option>
                        ))}
                    </select>
                    <button onClick={() => handleSubmitButton()} className={styles.websiteButton} > SUBMIT </button>
                </div>
        </Modal>
    );

};


export default AddNewProduct;