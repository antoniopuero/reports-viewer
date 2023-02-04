import { useEffect, useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import Head from 'next/head';
import { Inter } from '@next/font/google';
import styles from '@/styles/Home.module.css';
import { getTickers } from '@/external-apis/polygon-service';
import { sessionConfig } from '@/config';
import { useSocket } from '@/ws-communication/useSocket';
import Configuration from '@/components/Configuration';
import ChartView from '@/components/ChartView';

const inter = Inter({ subsets: ['latin'] });

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    return {
      props: {
        tickers: await getTickers(),
        reports: req.session.reports ?? null,
      },
    };
  },
  sessionConfig
);

export default function Home({
  tickers,
  reports,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  useSocket();
  const [config, changeConfig] = useState<{
    ticker?: string;
    duration?: string;
  }>({});

  return (
    <>
      <Head>
        <title>Reports viewer</title>
        <meta
          name="description"
          content="View and download crypto report as pdf"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Configuration
          tickers={tickers}
          config={config}
          changeConfig={(data) =>
            changeConfig((oldConfig) => ({ ...oldConfig, ...data }))
          }
        />
        <ChartView ticker={config.ticker} duration={config.duration} />
      </main>
    </>
  );
}
