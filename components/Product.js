import styles from '../styles/Product.module.css';
import React from 'react';

function Product (props) {

    const handleDeleteButton = () => {
        props.handleDeleteButton(props.name);
    };

    const handleEditButton = () => {
        props.handleEditButton(props.name, props.price, props.category);
    }

    return (
    <div className={styles.productContainer} >
        <h3 className={styles.nomProduit}>Produit: {props.name}</h3>
        <p className={styles.stock}>Stock: {props.stock}</p>
        <p className={styles.price}>Price: {props.price}</p>
        <p className={styles.category}>Category: {props.category}</p>
        <button className={styles.edit} onClick={() => handleEditButton()} > EDIT </button>
        <button className={styles.delete} onClick={() => handleDeleteButton()} > DELETE </button>
    </div>
    );
}

export default Product;
