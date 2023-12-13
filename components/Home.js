import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import LastSales from './LastSales';
import AddStock from './AddStock';

function Home() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const [openAddStockModal, setOpenAddStockModal] = useState(false);

  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);

  const handleAddStockButtonClick = () => {
    setOpenAddStockModal(true);
  };

  const handleCloseButton = () => {
    setOpenAddStockModal(false);
  };

  // console.log(user)
  return (
    <main className={styles.main}>
      <h1>Welcome</h1>
      <button className={styles.addProduct} onClick={handleAddStockButtonClick}>
        ADD STOCK
      </button>
      <LastSales />
      {openAddStockModal && <AddStock openAddStockModal={openAddStockModal} handleCloseButton={handleCloseButton} />}
    </main>
  );
}

export default Home;
