import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';

function Admin() {
    const [userData, setUserData] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const Data = [
            { id: 1, username: 'sam', email: 'gay@example.com', isAdmin: false },
            { id: 2, username: 'franck', email: 'dep@example.com', isAdmin: true },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
            { id: 3, username: 'siu', email: 'dragqueen@example.com', isAdmin: false },
        ];

        setUserData(Data);
    }, []);

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
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
                                        <button className={styles.editButton} onClick={() => openModal(user)}>
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {isModalOpen && (
                    <div className={styles.modal}>
                        <div className={styles.modalContent}>
                            <h2>User Information</h2>
                            <p>Username: {selectedUser?.username}</p>
                            <p>Email: {selectedUser?.email}</p>
                            <p>isAdmin: {selectedUser?.isAdmin ? 'Oui' : 'Non'}</p>
                            <button onClick={closeModal}>Fermer</button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default Admin;
