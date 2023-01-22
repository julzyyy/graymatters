import type { AppProps } from "next/app";
import Head from "next/head";

import { WagmiConfig, createClient } from "wagmi";

import "../styles/globals.css";

const client = createClient({
  autoConnect: true,
});

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <WagmiConfig client={client}>
      <Head>
        <title>the simpletons</title>
      </Head>
      <Component {...pageProps} />
    </WagmiConfig>
  );
};

export default MyApp;
