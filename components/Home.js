import styles from '../styles/Home.module.css';
import DrawerLeft from './DrawerLeft';
import { CaretRightOutlined  } from '@ant-design/icons';

import React, { useState } from 'react';

function Home() {

  const [isDrawerOpen, setIsDrawerOpen] = useState(true);


  const handleDrawerClick = () => {
    if(isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  };


  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Click here to see <a href="https://trello.com/b/6LNqv4qE/stockify">the planning</a>
        </h1>
        <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />
        <CaretRightOutlined onClick={handleDrawerClick} className={styles.drawerOpenLogo} />
      </main>
    </div>
  );
}

export default Home;