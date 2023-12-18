import styles from '../styles/Product.module.css';
import React from 'react';

function Product (props) {

    const handleDeleteButton = () => {
        props.handleDeleteButton(props.name);
    };

    const handleEditButton = () => {
        props.handleEditButton(props.name, props.price, props.category, props.stock, props.image);
    }

    return (
    <div className={styles.productContainer} >
        <div className={styles.nameAndImageContainer} >
        <p className={styles.nomProduit}>{props.name.toUpperCase()}</p>            
            <img src={props.image} alt={props.name} className={styles.image} />
        </div>
        <div className={styles.infoContainer} >
            <div className={styles.stockAndPrice} >
                <p className={styles.stock}>{props.stock} products in stock</p>
                <p className={styles.text}>Price: ${props.price}</p>
            </div>
           
            <p className={styles.text}>Category: {props.category}</p>
        </div>

        <div className={styles.buttonsContainer} >
            <button className={styles.button} onClick={() => handleEditButton()} > EDIT </button>
            <button className={styles.button} onClick={() => handleDeleteButton()} > DELETE </button>           
        </div>

    </div>
    );
}

export default Product;
