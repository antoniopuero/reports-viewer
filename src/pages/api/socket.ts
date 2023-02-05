import type { NextApiRequest } from 'next';
import { initializeSocket } from '@/sockets/server';
import { storeSocketForWorker } from '@/report-worker/worker';
import type { NextApiResponseServerIO } from '@/types';

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIO<void>
) {
    if (!res.socket.server.io) {
        res.socket.server.io = initializeSocket(
            res.socket.server as any,
            '/api/socket'
        );

        storeSocketForWorker(res.socket.server.io);
    }

    res.end();
}
