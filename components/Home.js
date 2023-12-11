import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';


function Login() {

  const router = useRouter();


  const redirectToAdmin = () => {
    router.push('admin');
  }



  return (
    <div>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Click here to see <a href="https://trello.com/b/6LNqv4qE/stockify">the planning</a>
        </h1>
        <button type="submit" onClick={()=> redirectToAdmin()}>Page admin</button>
      </main>
    </div>
  );
}

export default Login;