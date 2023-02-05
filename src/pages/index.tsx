import { useState } from 'react';
import { InferGetServerSidePropsType } from 'next';
import { withIronSessionSsr } from 'iron-session/next';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import { getTickers } from '@/external/polygon-service';
import { sessionConfig } from '@/config';
import { useSocket } from '@/sockets/client';
import Configuration from '@/components/Configuration';
import ChartView from '@/components/ChartView';
import ReportList from '@/components/ReportList';
import { getUserReports } from '@/external/redis';
import { REPORT_STATUSES } from '@/constants';
import { v4 as uuidv4 } from 'uuid';
declare module 'iron-session' {
  interface IronSessionData {
    id?: string;
    reports?: string[];
  }
}

export const getServerSideProps = withIronSessionSsr(
  async function getServerSideProps({ req }) {
    if (!req.session.id) {
      req.session.id = uuidv4();
      await req.session.save();
    }

    return {
      props: {
        tickers: await getTickers(),
        reports: await getUserReports(req.session.id as string),
        userId: req.session.id,
      },
    };
  },
  sessionConfig
);

export default function Home({
  tickers,
  reports,
  userId,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [currentReports, setCurrentReports] = useState(reports);
  const [reportProgress, setReportProgress] = useState<Record<string, number>>(
    {}
  );

  useSocket({
    userId,
    onProgress: (status, data) => {
      switch (status) {
        case REPORT_STATUSES.pending: {
          return setReportProgress((current) => ({
            ...current,
            [data.reportId]: data.progress,
          }));
        }
        case REPORT_STATUSES.failed: {
          return setCurrentReports((current) => ({
            ...current,
            [data.reportId]: 'failed',
          }));
        }
        case REPORT_STATUSES.finished: {
          return setCurrentReports((current) => ({
            ...current,
            [data.reportId]: 'finished',
          }));
        }
      }
    },
  });

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
          content="View and download stock candlesticks as pdf"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <ReportList
          reports={currentReports}
          progress={reportProgress}
          addReport={(report) => {
            setReportProgress((current) => ({
              ...current,
              [report.reportId]: 0,
            }));
            setCurrentReports((current) => ({
              ...current,
              [report.reportId]: report.status,
            }));
          }}
        />
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
