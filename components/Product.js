import styles from '../styles/Product.module.css';
import React from 'react';

function Product (props) {

    return (
    <div className={styles.productContainer} >
        <h3 className={styles.nomProduit}>Produit: {props.name}</h3>
        <p className={styles.stock}>Stock: {props.stock}</p>
        <p className={styles.category}>Category: {props.category}</p>
        <button className={styles.edit}>EDIT</button>
    </div>
    );
}

export default Product;
