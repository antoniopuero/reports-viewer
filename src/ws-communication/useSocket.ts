import { useEffect } from 'react';
import io from 'socket.io-client';
import { REPORT_STATUSES, SOCKET_EVENTS } from '@/constants';

export function useSocket({
    userId,
    onProgress,
}: {
    userId?: string;
    onProgress?: (status: string, data: any) => void;
}) {
    useEffect((): any => {
        const socket = io({ path: '/api/socket', auth: { userId } });

        socket.on(SOCKET_EVENTS.progress, (progress) =>
            onProgress?.(REPORT_STATUSES.pending, progress)
        );
        socket.on(SOCKET_EVENTS.finished, (report) =>
            onProgress?.(REPORT_STATUSES.finished, report)
        );
        socket.on(SOCKET_EVENTS.failed, (report) =>
            onProgress?.(REPORT_STATUSES.failed, report)
        );

        if (socket) return () => socket.disconnect();
    }, []);
}
