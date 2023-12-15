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
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //     FETCHING ALL CATÉGORIES         /////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const [category, setCategory] = useState([]);
  const [categoryId, setCategoryId] = useState('all'); // Set initial categoryId to 'all'
  const [filter, setFilter] = useState('categories'); // Ajout d'un état pour le filtre

  const [dataLoaded, setDataLoaded] = useState(false);

  const [chartData, setChartData] = useState([]);
  const [secondChartData, setSecondChartData] = useState([]); // Nouvel état pour le graphique de stock
  const [restockChartData, setRestockChartData] = useState([]); // Nouvel état pour le graphique de réapprovisionnement
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseCategories = await fetch('http://localhost:3000/categories/allCategories');
        const dataCategories = await responseCategories.json();
        setCategory(dataCategories.allCategories);
  
        const responseProducts = await fetch("http://localhost:3000/products/allProducts");
        const dataProducts = await responseProducts.json();
  
        let filteredProducts;
        if (categoryId === 'all') {
          filteredProducts = dataProducts.allProducts;
        } else {
          filteredProducts = dataProducts.allProducts.filter(product =>
            product.category.some(category => category._id === categoryId)
          );
        }
        const transformedDataSell = transformDataSell(filteredProducts);
        setChartData({...transformedDataSell});

        const transformedDataStock = transformDataStock(filteredProducts);
        setSecondChartData({...transformedDataStock});

        const transformedDataRestock = transformDataRestock(filteredProducts);
        setRestockChartData({...transformedDataRestock});
  
        setIsLoading(false);
        setDataLoaded(true); // Les données sont chargées
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setDataLoaded(true); // Une erreur s'est produite
      }
    };
  
    fetchData();
  }, [filter, categoryId, timeFilter]); // Ajoutez categoryId à la liste des dépendances




  /////////////////////////////////////////
  //     FETCHING ALL SELLS PRODUCTS     //
  /////////////////////////////////////////
  
  function transformDataSell(products) {
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    let salesByCategoryAndDate = {};
  
    for (const product of products) {
      const categoriesOrProducts = filter === 'categories' ? product.category : [product];
      for (const categoryOrProduct of categoriesOrProducts) {
        for (const sale of product.soldAt) {
          const date = new Date(sale.date);
          let key;
          switch (timeFilter) {
            case 'day':
              key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              break;
            case 'week':
              // Utilisez la date du premier jour de la semaine
              const firstDayOfWeek = date.getDate() - date.getDay();
              const weekStart = new Date(date.setDate(firstDayOfWeek));
              key = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              key = `${date.getFullYear()}-${date.getMonth() + 1}`;
              break;
            default:
              key = date.toISOString();
          }
  
          const name = filter === 'categories' ? categoryOrProduct.name : categoryOrProduct.name;
          if (!salesByCategoryAndDate[name]) {
            salesByCategoryAndDate[name] = {};
          }
  
          if (!salesByCategoryAndDate[name][key]) {
            salesByCategoryAndDate[name][key] = 0;
          }
  
          salesByCategoryAndDate[name][key] += sale.quantity;
        }
      }
    }
  
    // Get all unique dates
    const allDates = [...new Set([].concat(...Object.values(salesByCategoryAndDate).map(Object.keys)))].sort();
  
    const datasets = Object.entries(salesByCategoryAndDate).map(([categoryOrProductName, sales]) => ({
      label: categoryOrProductName,
      data: allDates.map(date => sales[date] || 0),
    }));
  
    return {
      labels: allDates,
      datasets: datasets,
    };
  }

  function transformDataStock(products) {
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    let salesByCategoryAndDate = {};
  
    for (const product of products) {
      const categoriesOrProducts = filter === 'categories' ? product.category : [product];
      for (const categoryOrProduct of categoriesOrProducts) {
        for (const sale of product.soldAt) {
          const date = new Date(sale.date);
          let key;
          switch (timeFilter) {
            case 'day':
              key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              break;
            case 'week':
              // Utilisez la date du premier jour de la semaine
              const firstDayOfWeek = date.getDate() - date.getDay();
              const weekStart = new Date(date.setDate(firstDayOfWeek));
              key = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              key = `${date.getFullYear()}-${date.getMonth() + 1}`;
              break;
            default:
              key = date.toISOString();
          }
  
          const name = filter === 'categories' ? categoryOrProduct.name : categoryOrProduct.name;
          if (!salesByCategoryAndDate[name]) {
            salesByCategoryAndDate[name] = {};
          }
  
          if (!salesByCategoryAndDate[name][key]) {
            salesByCategoryAndDate[name][key] = 0;
          }
  
          salesByCategoryAndDate[name][key] += sale.quantity;
        }
        // Ajoutez le stock du produit à la dernière date de vente
        if (product.soldAt.length > 0) {
          const lastSaleDate = new Date(product.soldAt[product.soldAt.length - 1].date);
          let lastKey;
          switch (timeFilter) {
            case 'day':
              lastKey = `${lastSaleDate.getFullYear()}-${lastSaleDate.getMonth() + 1}-${lastSaleDate.getDate()}`;
              break;
            case 'week':
              const firstDayOfWeek = lastSaleDate.getDate() - lastSaleDate.getDay();
              const weekStart = new Date(lastSaleDate.setDate(firstDayOfWeek));
              lastKey = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              lastKey = `${lastSaleDate.getFullYear()}-${lastSaleDate.getMonth() + 1}`;
              break;
            default:
              lastKey = lastSaleDate.toISOString();
          }
          salesByCategoryAndDate[categoryOrProduct.name][lastKey] += product.stock;
        }
      }
    }
  
    // Get all unique dates
    const allDates = [...new Set([].concat(...Object.values(salesByCategoryAndDate).map(Object.keys)))].sort();
  
    const datasets = Object.entries(salesByCategoryAndDate).map(([categoryOrProductName, sales]) => ({
      label: categoryOrProductName,
      data: allDates.map(date => sales[date] || 0),
    }));
  
    return {
      labels: allDates,
      datasets: datasets,
    };
  }


  function transformDataRestock(products) {
    if (!products || products.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }
  
    let restocksByCategoryAndDate = {};
  
    for (const product of products) {
      const categoriesOrProducts = filter === 'categories' ? product.category : [product];
      for (const categoryOrProduct of categoriesOrProducts) {
        for (const restock of product.restockAt) {
          const date = new Date(restock.date);
          let key;
          switch (timeFilter) {
            case 'day':
              key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
              break;
            case 'week':
              const firstDayOfWeek = date.getDate() - date.getDay();
              const weekStart = new Date(date.setDate(firstDayOfWeek));
              key = `${weekStart.getFullYear()}-W${Math.floor(weekStart.getDate() / 7) + 1}`;
              break;
            case 'month':
              key = `${date.getFullYear()}-${date.getMonth() + 1}`;
              break;
            default:
              key = date.toISOString();
          }
  
          const name = filter === 'categories' ? categoryOrProduct.name : categoryOrProduct.name;
          if (!restocksByCategoryAndDate[name]) {
            restocksByCategoryAndDate[name] = {};
          }
  
          if (!restocksByCategoryAndDate[name][key]) {
            restocksByCategoryAndDate[name][key] = 0;
          }
  
          restocksByCategoryAndDate[name][key] += restock.quantity;
        }
      }
    }
  
    const allDates = [...new Set([].concat(...Object.values(restocksByCategoryAndDate).map(Object.keys)))].sort();
  
    const datasets = Object.entries(restocksByCategoryAndDate).map(([categoryOrProductName, restocks]) => ({
      label: categoryOrProductName,
      data: allDates.map(date => restocks[date] || 0),
    }));
  
    return {
      labels: allDates,
      datasets: datasets,
    };
  }


 
  function BarChart({ chartData }) {

    if (chartData.labels.length === 0) {
      return <p>Aucun produit trouvé pour cette catégorie.</p>;
    }
  
    return <Bar data={chartData} />;
  }
  
  if (!dataLoaded) {
    return <div>Loading...</div>; // Vous pouvez rendre un spinner de chargement ou un autre indicateur de chargement ici
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.titleContainer}>
        <h1 className={styles.title}>Bienvenue dans les statistiques de vos Stocks</h1>
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
          {/* <div className={styles.renderByTemp}>
            {timeFilter === 'day' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridDay" />}
            {timeFilter === 'week' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridWeek" />}
            {timeFilter === 'month' && <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />}
          </div> */}
        </div>
      </div>
      <div className={styles.statsContainer}>
        <div className={styles.firstChart}>
          <h2>Statistiques des Ventes</h2>
          {!isLoading && <BarChart className={styles.firstChartCl} chartData={chartData} />}
        </div>
        <div className={styles.secondChart}>
          <h2>Statistiques des Stocks en cours</h2>
          {!isLoading && <BarChart className={styles.secondChartCl} chartData={secondChartData} />}
        </div>
        <div className={styles.thirdChart}>
          <h2>Statistiques des Réapprovisions</h2>
          {!isLoading && <BarChart className={styles.thirdChartCl} chartData={restockChartData} />}
        </div>
      </div>
    </div>
  )
};

export default StatsPage;
