import { SmileOutlined } from '@ant-design/icons';
import { Button, notification } from 'antd';
import { useEffect, useState } from 'react';

const NotificationButton = () => {


  const [dataProducts,setDataProducts] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await fetch ('http://localhost:3000/products/allProducts');
      if(!response.ok){
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setDataProducts(data.allProducts)
    }
    catch (error){
      console.error('Erreur lors du fetch ')
    }
  }

  console.log(dataProducts.stock)
  

  const openNotification = () => {
    notification.open({
      message: 'Notifications',
      description: 'Kevin est en rupture de glace',
      className: 'custom-class',
      duration: 1,
      style: {
        width: 600,
      },
      icon:(
        <SmileOutlined
        style={{
          color:'#108ee9',
        }}/>
      )
    });
  };



  return (
    <Button type="primary" onClick={openNotification}>
      Notifications
    </Button>
  );
};

export default NotificationButton;
