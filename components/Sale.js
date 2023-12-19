import styles from '../styles/Sale.module.css';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';



function Sale(props) {

    const [selectedOption, setSelectedOption] = useState(''); // Pour récupérer le produit choisie par le user
    const [productList, setProductList] = useState([]);
    const [sales, setSales] = useState([]);


    useEffect(() => { // Fetch la liste des produit pour le menu déroulant
        fetch('http://localhost:3000/products/allProducts')
        .then(response => response.json())
        .then(data => {
            let products = [];
            for (let i=0; i<data.allProducts.length; i++) {
                products.push(data.allProducts[i])
            };
            setProductList(products);
        })
    }, []);


    const handleCancel = () => { // Ferme la modal
        setIsOpen(false);
    };


    const handleSubmitButton = () => {
        fetch(`http://localhost:3000/products/sell/${selectedOption}/${sales}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
        })
        .then(response => response.json())
        .then(data => {
            props.handleCloseButton();
            props.refreshLastSale()
        });
    };


    const handleSelectChange = (event) => { // Gère le choix du produit
        setSelectedOption(event.target.value);
    };

    const handleStockInputChange = (event) => {
        // Vérifie que c'est bien un nombre
        const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

        if (isValidInput) {
            setSales(event.target.value);
        }
    };

    return (
        <Modal open={props.openSaleModal} onCancel={props.handleCloseButton} footer={null} width={800} height={800}>
            <div className={styles.title} > Today's Sales </div>
            <div className={styles.mainContainer}>
                <select onChange={handleSelectChange} >
                    <option value="" > Select a product </option>
                    {productList.map((data, index) => (
                    <option key={index} value={data.name} > {data.name} ({data.stock})</option>
                    ))}
                </select>
                <input type="number" onChange={handleStockInputChange} value={sales} placeholder="Quantity to add" />
                <button onClick={() => handleSubmitButton()} className={styles.websiteButton} > SUBMIT </button>
            </div>
        </Modal>
    );

};


export default Sale;