import Queue from 'bull';
import ReactPDF from '@react-pdf/renderer';
import type { Server as ServerIO } from 'socket.io';
import { redisUrl, storageFolder } from '@/config';
import { getTickers, getBars } from '@/external/polygon-service';
import { updateUserReport } from '@/external/redis';
import PdfReport from '@/components/PdfReport';
import { sendToUser } from '@/sockets/server';
import { SOCKET_EVENTS, REPORT_STATUSES } from '@/constants';

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

let io: ServerIO | null = null;

export const storeSocketForWorker = (socketIO: ServerIO) => {
  io = socketIO;
};

export const reportQueue = new Queue('pdf generation', redisUrl);

reportQueue.on('failed', async function (job, err) {
  console.error(err);
  await updateUserReport(
    job.data.userId,
    job.data.reportId,
    REPORT_STATUSES.failed
  );
  sendToUser(io, job.data.userId, SOCKET_EVENTS.failed, job.data);
});
reportQueue.on('progress', function (job) {
  sendToUser(io, job.data.userId, SOCKET_EVENTS.progress, {
    ...job.data,
    progress: job.progress(),
  });
});
reportQueue.on('completed', async function (job) {
  await updateUserReport(
    job.data.userId,
    job.data.reportId,
    REPORT_STATUSES.finished
  );
  sendToUser(io, job.data.userId, SOCKET_EVENTS.finished, job.data);
});

reportQueue.process(async (job) => {
  const tickers = await getTickers({ limit: 3 });
  const stepProgress = Math.floor(100 / tickers.length);
  const data = [];
  let progress = 0;

  for (const ticker of tickers) {
    // artificial slowing down, also not to hit rate limit
    await sleep(5000);
    const barData = await getBars({ ticker: ticker.ticker, duration: 'month' });
    progress += stepProgress;
    job.progress(progress);

    data.push({ ticker, barData });
  }

  await ReactPDF.render(
    <PdfReport data={data} />,
    `${storageFolder}/${job.data.reportId}.pdf`
  );

  return job.data;
});
