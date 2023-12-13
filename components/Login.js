import styles from '../styles/Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import jwt from 'jsonwebtoken';
import { login } from '../reducers/users';

function Login() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const router = useRouter();
  const user = useSelector((state) => state.user.value);

  if (user.token) {
    router.push('/home');
  }

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/users/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password,}),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.result) {
          dispatch(login({ token: data.data.token, username: data.data.email }));

        } else {
          console.error('ça marche pas ta mère');
        }
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  console.log(user.token)
  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.stockifyTitle}>Stockify</h1>
        <div className={styles.container}>
          <h3 className={styles.title}>Sign in</h3>
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={handleSubmit}>
              Se connecter
            </button>
            <p className={styles.forgotPassword} onClick={() => console.log('Forgot Password Clicked')}>
              Forgot Password?
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
