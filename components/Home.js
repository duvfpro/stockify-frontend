import styles from '../styles/Home.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faChevronDown, faWatchmanMonitoring } from '@fortawesome/free-solid-svg-icons';
import DrawerLeft from './DrawerLeft';
import LastSales from './LastSales';
import { CaretRightOutlined  } from '@ant-design/icons';

import React, { useState } from 'react';

function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClick = () => {
    if(isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
      <main className={styles.main}>

        <div className={styles.headerBar}>
          <div className={styles.iconsSection}>
            <FontAwesomeIcon icon={faBars} className={styles.iconTop} onClick={() => handleDrawerClick()} /> 
          </div>
          <div className={styles.iconsSection} >
            <FontAwesomeIcon icon={faBell} className={styles.iconTop} /> 
            <FontAwesomeIcon icon={faChevronDown} className={styles.iconTop} />
            <FontAwesomeIcon icon={faWatchmanMonitoring} className={styles.iconTop} />
          </div>
        </div>

        <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />

        <LastSales />
      </main>
  );
}

export default Home;