import { useEffect } from 'react';
import io from 'socket.io-client';

export function useSocket({
    onConnect = () => {},
    onProgress = () => {},
    onReady = () => {},
} = {}) {
    useEffect((): any => {
        const socket = io({ path: '/api/socket' });

        socket.on('connect', () => onConnect(socket));
        socket.on('report.progress', (reportProgress) =>
            onProgress(reportProgress)
        );
        socket.on('report.ready', (report) => onProgress(report));

        if (socket) return () => socket.disconnect();
    }, []);
}
