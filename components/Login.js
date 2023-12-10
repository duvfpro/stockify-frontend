import styles from '../styles/Login.module.css';
import { useState } from 'react';
import { useRouter } from 'next/router';








function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();



  const handleSubmit = () => {


    console.log(username);
    console.log(password);

    router.push('/home');
  }

  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.stockifyTitle}>Stockify</h1>
        <div className={styles.container}>
          <h3 className={styles.title}>Sign in</h3>
          <form className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" onClick={() => handleSubmit()}>Se connecter</button>
            <p className={styles.forgotPassword} onClick={() => console.log('Forgot Password Clicked')}>Forgot Password?</p>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Login;
