import styles from '../styles/SalesPage.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function SalesPage() {
    const router = useRouter();
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!user.token) {
          router.push('/');
        }
      }, [user.token, router]);
    
    return (
        <div>
        </div>
    )

};


export default SalesPage;