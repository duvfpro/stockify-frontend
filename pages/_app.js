import Head from 'next/head';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faChevronDown, faWatchmanMonitoring } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import '../styles/globals.css';
import DrawerLeft from '../components/DrawerLeft';
import styles from '../styles/Navbar.module.css';
import user from '../reducers/users';

const store = configureStore({
  reducer: { user },
});

function App({ Component, pageProps }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClick = () => {
    if (isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setIsDrawerOpen(true);
    }
  };

  const isLoginPage = router.pathname === '/'; // Vérifie si la page actuelle est la page de login

  return (
    <Provider store={store}>
      <Head>
        <title>Stockify</title>
      </Head>
      {!isLoginPage && ( // Affiche la barre de navigation sauf sur la page de login
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
      )}
      <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />
      <Component {...pageProps} />
    </Provider>
  );
}

export default App;
