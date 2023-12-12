import Head from 'next/head';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBell, faChevronDown, faWatchmanMonitoring } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';
import { Button, Modal } from 'antd'; // Importez Button et Modal depuis Ant Design

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
  const [modal2Open, setModal2Open] = useState(false);

  const handleDrawerClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleBellClick = () => {
    // Afficher la modal Ant Design
    setModal2Open(true);
  };

  const isLoginPage = router.pathname === '/';

  return (
    <Provider store={store}>
      <Head>
        <title>Stockify</title>
      </Head>
      {!isLoginPage && (
        <div className={styles.headerBar}>
          <div className={styles.iconsSection}>
            <FontAwesomeIcon icon={faBars} className={styles.iconTop} onClick={handleDrawerClick} />
          </div>
          <div className={styles.iconsSection}>
            <FontAwesomeIcon icon={faBell} className={styles.iconTop} onClick={handleBellClick} />
            <FontAwesomeIcon icon={faChevronDown} className={styles.iconTop} />
            <FontAwesomeIcon icon={faWatchmanMonitoring} className={styles.iconTop} />
          </div>
        </div>
      )}
      <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />
      <Component {...pageProps} />
      
      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={modal2Open}
        onOk={() => setModal2Open(true)}
        onCancel={() => setModal2Open(false)}
      >
        <p>some notifications...</p>
        <p>some notifications...</p>
        <p>some notifications...</p>
      </Modal>
    </Provider>
  );
}

export default App;
