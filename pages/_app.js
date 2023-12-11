import '../styles/globals.css';
import Head from 'next/head';
import { useState } from 'react';
import DrawerLeft from '../components/DrawerLeft';
import styles from '../styles/Navbar.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faChevronDown, faWatchmanMonitoring } from '@fortawesome/free-solid-svg-icons';



function App({ Component, pageProps }) {

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClick = () => {
    if(isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  };

  return (
    <>
      <Head>
        <title>Stockify</title>
      </Head>
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
      <Component {...pageProps}  />
    </>
  );
}

export default App;
