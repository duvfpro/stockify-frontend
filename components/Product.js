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
        <div className={styles.productContent}>
            <h3 className={styles.nomProduit}>Produit: {props.name}</h3>
            <img src={props.image} alt={props.name} />
            <p className={styles.stock}>Stock: {props.stock}</p>
            <p className={styles.price}>Price: {props.price}</p>
            <p className={styles.category}>Category: {props.category}</p>
        </div>
        <div className={styles.productBtn}>
            <button className={styles.edit} onClick={() => handleEditButton()} > EDIT </button>
            <button className={styles.deleteBtn} onClick={() => handleDeleteButton()} > DELETE </button>
        </div>
    </div>
    );
}

export default Product;
