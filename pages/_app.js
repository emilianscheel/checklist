import Head from 'next/head';
import styles from '../styles/styles.scss';

function MyApp({ Component, pageProps }) {
    return <>
      <Head>
        <title>Zum Erwachsen werden ...</title>
        <meta property="og:title" content="Zum Erwachsen werden ..." key="title" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@48,400,0,0" />
      </Head>
      <Component {...pageProps} />
    </>
  }

  export default MyApp
