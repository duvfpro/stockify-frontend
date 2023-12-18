import styles from '../styles/Header/Navbar.module.css';
import '../styles/globals.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import Head from 'next/head';

import { Provider } from 'react-redux';
import { useState } from 'react';
import { useRouter } from 'next/router';
import user from '../reducers/users';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';

import { combineReducers, configureStore } from '@reduxjs/toolkit';

import DrawerLeft from '../components/Header/DrawerLeft';
import NotificationButton from '../components/Header/Notifications';

const reducers = combineReducers({ user });

const persistConfig = { key: 'stockify', storage };

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

const persistor = persistStore(store);


function App({ Component, pageProps }) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClick = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };


  const isLoginPage = router.pathname === '/';

  const getPageTitle = () => {
    switch (router.pathname) {
      case '/admin':
        return 'Administrateur';
      case '/home':
        return 'Stockify';
      case '/products':
        return 'Produits';
      case '/sales':
        return 'Ventes';
      case '/statistics':
        return 'Statistique';
      case '/categories':
        return 'Categories';
      default:
        return 'Stockify';
    }
  };

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>{getPageTitle()}</title>
        </Head>

        {!isLoginPage && (
          <div className={styles.headerBar}>
            <div className={styles.iconsSection}>
              <FontAwesomeIcon icon={faBars} className={styles.iconTop} onClick={handleDrawerClick} />
            </div>
            <h3>{getPageTitle()}</h3>
            <div>
              <NotificationButton />
            </div>
          </div>
        )}
        <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick} />
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
