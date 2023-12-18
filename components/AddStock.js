import styles from '../styles/AddStock.module.css';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';


function AddStock(props) {
    console.log("refreshLastSale prop in AddStock:", props.refreshLastSale);
    console.log("handle close button called",props.handleCloseButton)
    const [selectedOption, setSelectedOption] = useState(''); // Pour récupérer le produit choisie par le user
    const [productList, setProductList] = useState([]);
    const [stockToAdd, setStockToAdd] = useState([]);
    

    useEffect(() => { // Fetch la liste des produit pour le menu déroulant
        fetch('http://localhost:3000/products/allProducts')
        .then(response => response.json())
        .then(data => {
            let products = [];
            for (let i=0; i<data.allProducts.length; i++) {
                products.push(data.allProducts[i].name)
            };
            setProductList(products);
        })
    }, []);


    const handleCancel = () => { // Ferme la modal
        setIsOpen(false);
    };


    const handleSubmitButton = () => {
        fetch(`http://localhost:3000/products/addStock/${selectedOption}/${stockToAdd}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            props.handleCloseButton();
<<<<<<< HEAD
            props.refreshLastSale()
            // window.location.reload()
=======
            window.location.reload();
>>>>>>> 5a805c079f24fdeffe484adc4e61d720faec4400
        })
    };


    const handleSelectChange = (event) => { // Gère le choix du produit
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
                    {productList.map((data, index) => (
                    <option key={index} value={data} > {data}</option>
                    ))}
                </select>
                <input type="number" onChange={handleStockInputChange} value={stockToAdd} placeholder="Quantity to add" />
                <button onClick={() => handleSubmitButton()} className={styles.websiteButton} > SUBMIT </button>
            </div>
        </Modal>
    );

};


export default AddStock;