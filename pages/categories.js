import Head from 'next/head';
import Categories from '../components/Categories';

function MyCategories() {
  return (
    <>
      <Head>
        <title>Categories</title>
      </Head>
      <Categories />
    </>
  );
} 

export default MyCategories;