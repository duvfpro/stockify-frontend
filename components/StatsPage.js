import styles from '../styles/StatsPage.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'

import { CategoryScale } from 'chart.js';
Chart.register(CategoryScale);
import Chart from 'chart.js/auto';

import React from "react";
import { Bar } from "react-chartjs-2";

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
  //          FILTERING BY TIME          //
  /////////////////////////////////////////

  const [timeFilter, setTimeFilter] = useState('day');

  const handleTimeSelectChange = (event) => {
    setTimeFilter(event.target.value);
  };

  /////////////////////////////////////////
  //          RENDERING BY TIME          //
  /////////////////////////////////////////

  const [date, setDate] = useState(new Date());

  const handleDateChange = (value) => {
    setDate(value);
  };
  
  /////////////////////////////////////////
  //     FETCHING ALL CATÉGORIES         //
  /////////////////////////////////////////

  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [filter, setFilter] = useState('categories'); // Ajout d'un état pour le filtre

useEffect(() => { 
  fetch('http://localhost:3000/categories/allCategories')
    .then(response => response.json())
    .then(data => {
      setCategory(data.allCategories);
      setCategoryId('all');

      // Une fois que nous avons l'ID de la catégorie, nous pouvons obtenir tous les produits
      fetch("http://localhost:3000/products/allProducts")
        .then((response) => response.json())
        .then((data) => {
          const transformedData = transformData(data.allProducts);
          setChartData(transformedData);
          setIsLoading(false); // Les données sont chargées
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false); // Une erreur s'est produite
        });
    });
}, [filter, categoryId]); // Ajoutez filter et categoryId comme dépendances


const handleSelectChange = (event) => { 
  let catName = event.target.value;
  let id;
  if (catName === 'all') {
    setCategoryId('all');
    fetch("http://localhost:3000/products/allProducts")
      .then((response) => response.json())
      .then((data) => {
        const transformedData = transformData(data.allProducts);
        setChartData(transformedData);
        setIsLoading(false); // Les données sont chargées
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // Une erreur s'est produite
      });
  } else {
    id = category.find(element => element.name === catName);
    setCategoryId(id._id);
    fetch(`http://localhost:3000/products/category/${id._id}`)
      .then((response) => response.json())
      .then((data) => {
        const transformedData = transformData(data.allProducts);
        setChartData(transformedData);
        setIsLoading(false); // Les données sont chargées
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false); // Une erreur s'est produite
      });
  }
};



  /////////////////////////////////////////
  //     FETCHING ALL SELLS PRODUCTS     //
  /////////////////////////////////////////

  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  

  function transformData(products) {
    if (!Array.isArray(products)) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    if (filter === 'categories') {
      let filteredProducts;
      if (categoryId === 'all') {
        // Si l'utilisateur a sélectionné "Toutes les catégories", incluez tous les produits
        filteredProducts = products;
      } else {
        // Sinon, filtrez les produits pour n'inclure que ceux de la catégorie sélectionnée
        filteredProducts = products.filter(product =>
          product.category.some(category => category._id === categoryId)
        );
      }
  
      // Créez un objet pour stocker le total vendu par catégorie
      const totalsByCategory = {};
  
      // Parcourez chaque produit
      for (const product of filteredProducts) {
        // Parcourez chaque catégorie du produit
        for (const category of product.category) {
          // Si la catégorie n'est pas encore dans l'objet, ajoutez-la
          if (!totalsByCategory[category.name]) {
            totalsByCategory[category.name] = 0;
          }
  
          // Ajoutez la quantité vendue à la catégorie
          for (const sale of product.soldAt) {
            totalsByCategory[category.name] += sale.quantity;
          }
        }
      }
  
      // Transformez l'objet en deux tableaux pour Chart.js
      const labels = Object.keys(totalsByCategory);
      const data = Object.values(totalsByCategory);
  
      return {
        labels: labels,
        datasets: [
          {
            label: "Produits vendus",
            data: data,
          },
        ],
      };
    } else {
      // Logique pour afficher les produits vendus
      return {
        labels: products.map((product) => product.name),
        datasets: [
          {
            label: "Produits vendus",
            data: products.map((product) =>
              product.soldAt?.length > 0
                ? product.soldAt.reduce((total, sale) => total + sale.quantity, 0)
                : 0
            ),
          },
        ],
      };
    }
  }
  
  
  function BarChart({ chartData }) {
    return <Bar data={chartData} />;
  }

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
            <p>Filter by Temps</p>
            <select onChange={handleTimeSelectChange}>
              <option value="day">Par Jour</option>
              <option value="week">Par Semaine</option>
              <option value="month">Par Mois</option>
            </select>
          </div>
          <div className={styles.filterByObject}>
            <p>Filter by Object</p>
            <select onChange={(e) => setFilter(e.target.value)}>
              <option value="categories">Catégories</option>
              <option value="products">Produits</option>
            </select>
          </div>
        </div>
        <div className={styles.renderFilterArea}>
          <div className={styles.renderByTemp}>
            {timeFilter === 'day' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridDay" />}
            {timeFilter === 'week' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" />}
            {timeFilter === 'month' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />}
          </div>
          <div className={styles.renderByObject}>
            <p>Render by Object</p>
            {filter === 'categories' && category.length > 0 && (
              <select onChange={handleSelectChange} >
                <option value="all">Toutes les catégories</option> {/* Nouvelle option */}
                {category.map((data, index) => (
                  <option key={index} value={data.name}> {data.name} </option>
                ))}
              </select>
            )}
            {filter === 'products' && <p>Produits</p>}
          </div>
        </div>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.firstChart}>
          <h2>First Chart</h2>
          {!isLoading && <BarChart chartData={chartData} />}
        </div>
        <div className={styles.secondChart}>
          <h2>Second Chart</h2>
        </div>
      </div>
    </div>
  )
};

export default StatsPage;
