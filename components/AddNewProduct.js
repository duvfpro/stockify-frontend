import styles from '../styles/AddNewProduct.module.css';
import { Modal } from 'antd';
import React, { useState, useEffect } from 'react';


function AddNewProduct(props) {

    const [productName, setProductName] = useState('');
    const [productStock, setProductStock] = useState(0);
    const [productPrice, setProductPrice] = useState(null);
    const [productImage, setProductImage] = useState("http://localhost:3000/stockpic.jpg");
    const [category, setCategory] = useState([]);
    const [categotyId, setCategoryId] = useState('');
    const [selectedOption, setSelectedOption] = useState(''); // Stock le choix de la catégorie


    useEffect(() => { // fetch toutes les catégories pour le menu déroulant de la modal
        fetch('http://localhost:3000/categories/allCategories')
        .then(response => response.json())
        .then(data => {
            let categories = [];
            for (let i=0; i<data.allCategories.length; i++) {
                categories.push({name: data.allCategories[i].name, _id: data.allCategories[i]._id})
            };
            setCategory(categories);
            setCategoryId(categories[0]._id);
        });
    }, []);


    const handleCancel = () => { // Ferme la modal
        setIsOpen(false);
    };

    const handleSubmitButton = () => { // Manque à pouvoir ajouter du stock à la création et une IMAGE

        if(productImage === "http://localhost:3000/stockpic.jpg") {
            fetch('http://localhost:3000/products/newProduct', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: productName, image: productImage, stock: 0, category: categotyId, price: productPrice }),
                })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                });
                props.handleCloseButton(); 
        } 
        else {
            const formData = new FormData();
            formData.append('photoFromFront', productImage);
            formData.append('name', productName);
            formData.append('stock', 0);
            formData.append('category', categotyId);
            formData.append('price', productPrice); 

        fetch('http://localhost:3000/products/newProductWithImage', {
            method: 'POST',
            body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            });
            props.handleCloseButton(); 
        }
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

    const handlePriceInputChange = (event) => {
        const isValidInput = /^-?\d*\.?\d*$/.test(event.target.value);

        if (isValidInput) {
            setProductPrice(event.target.value);
        };
    };

    const handleImageInputChange = (e) => {
        const file = e.target.files[0];
        setProductImage(file);
    };
    

    const handleSelectChange = (event) => { // Gère le choix de la catégorie et cherche son ID
        let catName = event.target.value;
        let id=category.find(element => element.name === catName)
        setCategoryId(id._id);
    };


    return (
        <Modal open={props.openAddProductModal} onCancel={props.handleCloseButton} footer={null} width={800} height={800}>
            <div className={styles.title} > ADD NEW PRODUCT </div>
                <div className={styles.mainContainer}>
                    <input type="text" onChange={handleNameInputChange} value={productName} placeholder="Product name" required />
                    {/* <input type="number" onChange={handleStockInputChange} value={productStock} placeholder="Stock" required /> */}
                    <input type="number" onChange={handlePriceInputChange} value={productPrice} placeholder="Price" required />
                    <input type="file" onChange={handleImageInputChange} accept="image/*" />
                    <select onChange={handleSelectChange} >
                        {category.map((data, index) => (
                        <option key={index} value={data.name}> {data.name} </option>
                        ))}
                    </select>
                    <button onClick={() => handleSubmitButton()} className={styles.websiteButton} > SUBMIT </button>
                </div>
        </Modal>
    );

};


export default AddNewProduct;