import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css';
import LastSales from './LastSales';
import AddStock from './AddStock';
import Sale from './Sale';



function Home() {
  const user = useSelector((state) => state.user.value);
  const router = useRouter();
  const [openAddStockModal, setOpenAddStockModal] = useState(false);
  const [openSaleModal, setSaleModal] = useState(false);


  useEffect(() => {
    if (!user.token) {
      router.push('/');
    }
  }, [user.token, router]);

  const handleAddStockButtonClick = () => {
    setOpenAddStockModal(true);
  };

  const handleSaleButtonClick = () => {
    setSaleModal(true);
  };

  const handleCloseButton = () => {
    setOpenAddStockModal(false);
    setSaleModal(false);
  };

  return (
    <main className={styles.main}>
      <h1>Welcome</h1>
      <button className={styles.addProduct} onClick={handleAddStockButtonClick}>
        ADD STOCK
      </button>
      <button onClick={handleSaleButtonClick}>
        SALE PRODUCTS
      </button>
      <LastSales />
      {openAddStockModal && <AddStock openAddStockModal={openAddStockModal} handleCloseButton={handleCloseButton} />}
      {openSaleModal && <Sale openSaleModal={openSaleModal} handleCloseButton={handleCloseButton} />}
    </main>
  );
}

export default Home;
