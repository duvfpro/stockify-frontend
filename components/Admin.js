import { useEffect, useState } from 'react';
import styles from '../styles/Admin.module.css';

function Admin() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    // Exemple de données en dur pour tester
    const dummyData = [
      { id: 1, username: 'sam', email: 'gay@example.com', isAdmin: false },
      { id: 2, username: 'franck', email: 'dep@example.com', isAdmin: true },
      { id: 3, username: 'nathan', email: 'dragqueen@example.com', isAdmin: false },
    ];
  
    setUserData(dummyData);
  }, []);
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>Page lol</h1>
        
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>isAdmin</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? 'Oui' : 'Non'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default Admin;
