import styles from '../styles/Drawer.module.css';
import { Drawer } from 'antd';
import { useRouter } from 'next/router';


const DrawerLeft = (props) => {

  const router = useRouter();

  const onClose = () => {
    props.handleDrawerClick();
  };

  return (
    <>
      <Drawer title="Accueil" onClick={() => router.push('/home')} placement='left' width={200} onClose={onClose} open={props.isDrawerOpen} className={styles.main} >
        <p onClick={() => router.push('/products')} > Products </p>
        <p onClick={() => router.push('/sales')} > Sales </p>
        <p onClick={() => router.push('/statistics')} > Statistics </p>
        <p onClick={() => router.push('/admin')} > Admin </p>
      </Drawer>
    </>
  );
};
export default DrawerLeft;