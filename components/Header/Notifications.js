import { SmileOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { useEffect, useState } from 'react';

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
      const lastProduct = product.soldAt.length - 1;
      if (product.stock <= 5) {
        openNotification(product.name, product.stock, product.soldAt[lastProduct].date);
      }
    });
  };

  const openNotification = (productName, productStock, soldAt) => {
    notification.open({
      message: 'Notifications',
      description: (
        <div>
          <p>
            Stock de{' '}
            <span style={{ fontWeight: 'bold' }}>{productName}</span> est critique à{' '}
            <span style={{ color: 'red', fontWeight: 'bold' }}>{productStock}</span>.
          </p>
          <p>
            La dernière vente est :
          <span style={{ fontWeight: 'bold' }}> {soldAt}</span>.
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
    <Button type="primary" onClick={fetchData}>
      Notifications
    </Button>
  );
};

export default NotificationButton;
