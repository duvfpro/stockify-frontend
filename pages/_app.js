import Head from 'next/head';
import { useState } from 'react';
import { Provider } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faBaseball } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router';

import '../styles/globals.css';
import DrawerLeft from '../components/DrawerLeft';
import styles from '../styles/Navbar.module.css';
import user from '../reducers/users';

import { persistStore, persistReducer } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import storage from 'redux-persist/lib/storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';

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

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Head>
          <title>Stockify</title>
        </Head>

        {!isLoginPage && (
          <div className={styles.headerBar}>
            <div className={styles.iconsSection}>
              <FontAwesomeIcon icon={faBars} className={styles.iconTop} onClick={handleDrawerClick} />
            </div>
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
