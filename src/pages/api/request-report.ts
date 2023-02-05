import type { NextApiRequest } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { v4 as uuidv4 } from 'uuid';
import { storeSocketForWorker, reportQueue } from '@/report-worker/worker';
import { updateUserReport } from '@/external/redis';
import { sessionConfig } from '@/config';
import type { NextApiResponseServerIO } from '@/types';
import { REPORT_STATUSES } from '@/constants';

type ReportInQueue = {
    reportId: string;
    status: string;
};

export default withIronSessionApiRoute(
    async function handler(
        req: NextApiRequest,
        res: NextApiResponseServerIO<ReportInQueue>
    ) {
        const reportId = uuidv4();

        storeSocketForWorker(res.socket.server.io);

        await reportQueue.add({ reportId, userId: req.session.id });

        await updateUserReport(
            req.session.id as string,
            reportId,
            REPORT_STATUSES.pending
        );
        res.status(200).json({
            reportId,
            status: REPORT_STATUSES.pending,
        });
    } as any,
    sessionConfig
);
