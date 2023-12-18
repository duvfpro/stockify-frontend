import styles from '../styles/Categories.module.css';
import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';

function Categories() {

    const [categoriesTab, setCategoriesTab] = useState([]);
    const [refreshProducts, setRefreshProducts] = useState([]);
    const [openNewCatModal, setOpenNewCatModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    useEffect(() => {
        fetch('http://localhost:3000/categories/allCategories')
            .then(response => response.json())
            .then(data => {
                setCategoriesTab(data.allCategories);
            });
    }, [refreshProducts]);


    const addNewCategory = () => {
        setOpenNewCatModal(true);
    };

    const closeNewCatModal = () => {
        setOpenNewCatModal(false);
        setNewCategoryName('');
    };

    const handleNewNameInputChange = (event) => {
        setNewCategoryName(event.target.value);
    };

    const handleNewSaveButton = () => {
        fetch('http://localhost:3000/categories/newCategory', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newCategoryName, image: "No Image for now" })
        })
        .then(response => response.json())
        .then(() => {
            setRefreshProducts(!refreshProducts);
            closeNewCatModal();
        })
    };

    const CategoryItem = ({ data }) => { // Thank you chat GPT
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
        };

        const handleDeleteButton = (name, id) => {
            fetch(`http://localhost:3000/products/productsByCategoryId`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId: id })
            })
            .then(response => response.json())
            .then(data => {
                if(data.result==true) {     
                    for(let i=0; i<data.allProducts.length; i++) {
                        fetch(`http://localhost:3000/products/updateMyProduct/${data.allProducts[i].name}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ name: data.allProducts.name, category: '657ab87025ea6d64cea475e6' })
                        })
                        .then(response => response.json())
                        .then((data2) => {
                            console.log(data2)
                        })
                    }
                }
            })
            .then(fetch(`http://localhost:3000/categories/deleteMyCategory/${name}`, {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json' },
            })
            .then(() => {
                setRefreshProducts(!refreshProducts);
            }))  
        };


        return (
            <div key={data._id} className={styles.categoryContainer}>
                <h3 className={styles.categoryname}>Category: {data.name} </h3>
                <button className={styles.edit} onClick={handleEditButton}> EDIT </button>
                <button className={styles.deleteBtn} onClick={() => handleDeleteButton(data.name, data._id)}> DELETE </button>

                <Modal open={openEditModal} onCancel={closeEditModal} footer={null} width={800} height={800}>
                    <div className={styles.titleEditMod}> UPDATE {data.name} ({data._id}) </div>
                    <div className={styles.mainEditModContainer}>
                        <input type="text" onChange={handleNameInputChange} value={categoryName} placeholder="New Category name" />
                        <button onClick={() => handleSaveButton(data.name, data._id)}> SUBMIT </button>
                    </div>
                </Modal>
            </div>
        );
    };

    return (
        <div className={styles.mainCatContainer}>
            <div className={styles.title}>
                <button className={styles.addButton} onClick={() => addNewCategory()}> ADD NEW CATEGORY </button>
            </div>
            <div className={styles.cardMapContainer}>
                {categoriesTab.map((data) => {
                    if (data.name === "NoAssign") {
                        return null;
                    } else {
                        return <CategoryItem key={data._id} data={data} />;
                    }
                })}
                
                <Modal open={openNewCatModal} onCancel={closeNewCatModal} footer={null} width={800} height={800}>
                    <div className={styles.addBtnCat}> ADD NEW CATEGORY </div>
                    <div className={styles.mainNewCatContainer}>
                        <input type="text" className={styles.inputNewCat} onChange={handleNewNameInputChange} value={newCategoryName} placeholder="Category name" />
                        <button onClick={() => handleNewSaveButton()}> SUBMIT </button>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Categories;