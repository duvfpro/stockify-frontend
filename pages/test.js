import Head from 'next/head';
import TestPage from '../components/Test';

function Test() {
  return (
    <>
      <Head>
        <title>test</title>
      </Head>
      <TestPage />
    </>
  );
}

export default Test;