// DrawerLeft.jsx

import { Drawer } from 'antd';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { logout } from '../reducers/users';
import styles from '../styles/Drawer.module.css'; // Importez le fichier CSS

const DrawerLeft = (props) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const onClose = () => {
    props.handleDrawerClick();
  };

  return (
    <>
      <Drawer title="Accueil" onClick={() => router.push('/home')} placement='left' width={200} onClose={onClose} open={props.isDrawerOpen} className={styles.main}>
        <p className={styles['drawer-link']} onClick={() => router.push('/products')}> Products </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/sales')}> Sales </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/statistics')}> Statistics </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/admin')}> Admin </p>
        <button onClick={() => { dispatch(logout()); }}>Logout</button>
      </Drawer>
    </>
  );
};

export default DrawerLeft;
