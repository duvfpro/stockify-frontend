import styles from '../styles/Drawer.module.css';
import React, { useState } from 'react';
import { Drawer } from 'antd';
import { CaretRightOutlined  } from '@ant-design/icons';
import { useRouter } from 'next/router';


const DrawerLeft = (props) => {

  const router = useRouter();


  const showDrawer = () => {
    props.handleDrawerClick();
  };

  const onChange = (e) => {
    setPlacement(e.target.value);
  };

  const onClose = () => {
    props.handleDrawerClick();
  };


  return (
    <>
      <Drawer title="Accueil" placement='left' width={200} onClose={onClose} open={props.isDrawerOpen} className={styles.main} >
        <p>Produits </p>
        <p>Ventes </p>
        <p>Statistiques </p>
        <p onClick={() => router.push('/admin')} >Admin </p>
      </Drawer>
    </>
  );
};
export default DrawerLeft;