import styles from '../styles/Categories.module.css';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

function Categories() {
    const [categoriesTab, setCategoriesTab] = useState([]);
    const [refreshProducts, setRefreshProducts] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/categories/allCategories')
            .then(response => response.json())
            .then(data => {
                setCategoriesTab(data.allCategories);
            });
    }, [refreshProducts]);

    const handleDeleteButton = (name) => {
        fetch(`http://localhost:3000/categories/deleteCategory/${name}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(() => {
                setRefreshProducts(!refreshProducts);
            });
    };

    const CategoryItem = ({ data }) => {
        const [openEditModal, setOpenEditModal] = useState(false);
        const [categoryName, setCategoryName] = useState('');

        const handleEditButton = () => {
            setOpenEditModal(true);
        };

        const closeEditModal = () => {
            setOpenEditModal(false);
        };

        const handleNameInputChange = (event) => {
            setCategoryName(event.target.value);
        };

        const handleSaveButton = (name, id) => {
            fetch(`http://localhost:3000/products/productsByCategoryId`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: id })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.allProducts)
                for(let i=0; i<data.allProducts.length; i++) {
                    fetch(`http://localhost:3000/products/updateMyProduct/${data.allProducts.name}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ category: '657ab87025ea6d64cea475e6' })
                    });
                }
            })
            .then(() => {
                fetch(`http://localhost:3000/categories/updateCategory/${name}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: categoryName })
                })
                .then(response => response.json())
                .then(() => {
                    setOpenEditModal(false);
                    setRefreshProducts(!refreshProducts);
                })
            })
          };


        return (
            <div key={data._id} className={styles.categoryContainer}>
                <h3 className={styles.categoryname}>Category: {data.name} </h3>
                <button className={styles.edit} onClick={handleEditButton}> EDIT </button>
                <button className={styles.delete} onClick={() => handleDeleteButton(data.name)}> DELETE </button>
                <Modal open={openEditModal} onCancel={closeEditModal} footer={null} width={800} height={800}>
                    <div className={styles.title}> UPDATE {data.name} ({data._id}) </div>
                    <div className={styles.mainContainer}>
                        <input type="text" onChange={handleNameInputChange} value={categoryName} placeholder="New Category name" />
                        <button onClick={() => handleSaveButton(data.name, data._id)}> SUBMIT </button>
                    </div>
                </Modal>
            </div>
        );
    };

    return (
        <div>
            {categoriesTab.map((data) => {
                if (data.name === "NoAssign") {
                    return null;
                } else {
                    return <CategoryItem key={data._id} data={data} />;
                }
            })}
        </div>
    );
}

export default Categories;