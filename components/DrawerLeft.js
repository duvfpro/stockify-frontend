import styles from '../styles/Drawer.module.css';
import { Drawer } from 'antd';

import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import { logout } from '../reducers/users';

const DrawerLeft = (props) => {

  const dispatch = useDispatch();
  const router = useRouter();

  const onClose = () => {
    props.handleDrawerClick();
  };

  return (
    <>
      <Drawer
        title="Accueil"
        onTitleClick={() => router.push('/home')}
        placement="left"
        width={200}
        onClose={onClose}
        visible={props.isDrawerOpen}
        className={styles.main}
      >
        <p className={styles['drawer-link']} onClick={() => router.push('/products')}> Products </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/sales')}> Sales </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/statistics')}> Statistics </p>
        <p className={styles['drawer-link']} onClick={() => router.push('/admin')}> Admin </p>
        <p className={styles['sign-out-button']} onClick={() => { dispatch(logout()); }}>Sign out</p>
      </Drawer>
    </>
  );
};

export default DrawerLeft;
