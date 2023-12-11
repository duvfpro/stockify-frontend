import styles from '../styles/AddStock.module.css';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';


function AddStock(props) {

    const [selectedOption, setSelectedOption] = useState(''); // Pour récupérer la catégories choisie par le user
    const [productList, setproductList] = useState([]);
    const [stockToAdd, setStockToAdd] = useState([]);


    useEffect(() => { // Fetch la liste des produit pour le menu déroulant
        fetch('http://localhost:3000/products/allProducts')
        .then(response => response.json())
        .then(data => {
            let products = [];
            for (let i=0; i<data.allProducts.length; i++) {
                products.push(data.allProducts[i].name)
            };
            setproductList(...productList, products);
        })
    }, []);



    const handleCancel = () => { // Ferme la modal
        setIsOpen(false);
      };

    const handleSubmitButton = () => {

    };


    const handleSelectChange = (event) => { // Gère le choix de la catégorie
        setSelectedOption(event.target.value);
    };

    const handleStockInputChange = (event) => {
        // Vérifie que c'est bien un nombre
        const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

        if (isValidInput) {
            setStockToAdd(event.target.value);
        }
    };

    return (
        <Modal open={props.openAddStockModal} onCancel={props.handleCloseButton} footer={null} width={800} height={800}>
            <div className={styles.title} > ADD STOCK </div>
            <div className={styles.mainContainer}>
                <select onChange={handleSelectChange} >
                    <option value="" > Select a product </option>
                    {productList.map((option, index) => (
                    <option key={index} value="productList">{productList}</option>
                    ))}
                </select>
                <input type="number" onChange={handleStockInputChange} value={stockToAdd} placeholder="Quantity to add" />
                <button onClick={() => handleSubmitButton()} className={styles.websiteButton} > SUBMIT </button>
            </div>
        </Modal>
    );

};


export default AddStock;