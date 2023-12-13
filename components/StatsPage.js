import styles from '../styles/StatsPage.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import {View} from 'react'
import Category from '../../backend/models/categories';

function StatsPage() {

  const router = useRouter();
  const user = useSelector((state) => state.user.value);

  /////////////////////////////////////////
  //             TOKEN USER              //
  /////////////////////////////////////////

  useEffect(() => {
      if (!user.token) {
        router.push('/');
      }
    }, [user.token, router]);
  
  /////////////////////////////////////////
  //     FETCHING ALL CATÉGORIES         //
  /////////////////////////////////////////

  const [catData,setCatData] = useState('')

  useEffect(() => {
    const fetchCatData = async ()=>{
      try{
        const response = await fetch('http://localhost:3000/categories/allCategories');
        if(!response.ok){
          throw new Error (`Error : ${response.status}`)
        }
        const data = await response.json();

        //console.log(data.allCategories)

        const formattedData = data.allCategories.map((category)=> ({
          key: category._id,
          name: category.name,
        }));
       setCatData(formattedData); 

      } catch (error) {
        console.error('Erreur lors du fetch des données : ', error);
      }
    }
    fetchCatData()
  }, [])

  console.log(catData)

  /////////////////////////////////////////
  //     FETCHING ALL SELLS PRODUCTS     //
  /////////////////////////////////////////

  return (

    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
          <h1 className={styles.title}>Bienvenue dans les statiques de vos Stocks</h1>
      </div>

      <div className={styles.filterContainer}>
        <div className={styles.filterArea}>
          <div className={styles.filterByTemp}>
            <h2>Render by Temps</h2>
          </div>
          <div className={styles.filterByObject}>
            <h2>Filter by Object</h2>
          </div>
        </div>
        <div className={styles.renderFilterArea}>
          <div className={styles.renderByTemp}>
            <h2>Render by Temps</h2>
          </div>
          <div className={styles.renderByObject}>
            <h2>Render by Object</h2>
          </div>
        </div>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.firstChart}>
          <h2>First Chart</h2>
        </div>
        <div className={styles.secondChart}>
          <h2>Seccond Chart</h2>
        </div>
      </div>
    </div>

  )
};


export default StatsPage;