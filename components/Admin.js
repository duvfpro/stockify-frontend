import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';
import DrawerLeft from './DrawerLeft';

function Admin() {
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const Data = [
            { id: 1, username: 'sam', email: 'gay@example.com', isAdmin: false },
            { id: 2, username: 'franck', email: 'dep@example.com', isAdmin: true },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },

        ];

        setUserData(Data);
    }, []);




    const [isDrawerOpen, setIsDrawerOpen] = useState(true);

    const handleDrawerClick = () => {
        if (isDrawerOpen) {
            setIsDrawerOpen(false);
        } else {
            setIsDrawerOpen(true);
        }
    };


    return (
        <div>
            <main className={styles.main}>
                <h1 className={styles.title}>Page Administrateur</h1>
                <div className={styles.tableContainer}>
                    <table>
                        <thead>
                            <tr>
                                <th className={styles.tableHeader}>Username</th>
                                <th className={styles.tableHeader}>Email</th>
                                <th className={styles.tableHeader}>isAdmin</th>
                                <th className={styles.tableHeader}>Actions</th>

                            </tr>
                        </thead>
                        <tbody>
                            {userData.map((user) => (
                                <tr key={user.id}>
                                    <td className={styles.tableCell}>{user.username}</td>
                                    <td className={styles.emailCell}>{user.email}</td>
                                    <td className={styles.tableCell}>{user.isAdmin ? 'Oui' : 'Non'}</td>
                                    <td className={styles.tableCell}>
                                        <button className={styles.editButton}>Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <DrawerLeft isDrawerOpen={isDrawerOpen} handleDrawerClick={handleDrawerClick}/>
            </main>
        </div>
    );


}

export default Admin;
