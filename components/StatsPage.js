import styles from '../styles/StatsPage.module.css';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

function StatsPage() {

    const router = useRouter();
    const user = useSelector((state) => state.user.value);

    useEffect(() => {
        if (!user.token) {
          router.push('/');
        }
      }, [user.token, router]);
    

    return (
        <div>
            <h1>StatsPage</h1>
        </div>
    )
};


export default StatsPage;