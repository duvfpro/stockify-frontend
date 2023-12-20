import { SmileOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import styles from '../../styles/Header/Notification.module.css'

const NotificationButton = () => {
  const [dataProducts, setDataProducts] = useState(null);

  useEffect(() => {
    
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3000/products/allProducts');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      setDataProducts(data.allProducts);
      checkStockAndNotify(data.allProducts);

    } catch (error) { 
      console.error('Erreur lors du fetch', error);
    }
  };

  const checkStockAndNotify = (products) => {
    products.forEach((product) => {
      if (product && product.stock && product.soldAt && product.soldAt.length > 0) {
        const lastProduct = product.soldAt.length - 1;
        if (product.stock <= 5) {
          openNotification(product.storeName, product.stock, product.soldAt[lastProduct].date);
        }
      }
    });
  };
  

  const openNotification = (productName, productStock, soldAt) => {
    notification.open({
      message: 'Notifications',
      description: (
        <div className={styles.mainContainer}>
          <p>
            Stock de{' '}
            <span style={{  color: 'black', fontWeight: 'bold' }}>{productName}</span> est critique à{' '}
            <span style={{ color: 'red', fontWeight: 'bold' }}>{productStock}</span>.
          </p>
          <p>
            La dernière vente est :
          <span style={{ color: 'black', fontWeight: 'bold' }}> {soldAt}</span>.
          </p>
        </div>
      ),
      className: 'custom-class',
      duration: 2,
      style: {
        width: 600,
      },
      icon: (
        <SmileOutlined
          style={{
            color: '#108ee9',
          }}
        />
      ),
    });
  };

  return (
    <BellOutlined style={{fontSize:'24px'}} onClick={fetchData}>
      Notifications
    </BellOutlined>
  );
};

export default NotificationButton;
