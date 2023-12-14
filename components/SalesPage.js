import styles from '../styles/SalesPage.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import LastSales from './LastSales';

function SalesPage() {
    const router = useRouter();
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!user.token) {
          router.push('/');
        }
      }, [user.token, router]);
    
    return (
        <div className={styles.main}>
            <h1>SalesPage</h1>
            <div className={styles.sales}>
              <LastSales/>
            </div>
        </div>
    )

};


export default SalesPage;