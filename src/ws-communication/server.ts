import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import {
    setUserSocketId,
    deleteUserSocketId,
    getUserSocketId,
} from '@/external/redis';

export const initializeSocket = (httpServer: NetServer, path: string) => {
    const io = new ServerIO(httpServer, { path });

    io.on('connection', async (socket) => {
        const userId = socket.handshake.auth.userId;
        await setUserSocketId(userId, socket.id);
        socket.once('disconnect', async () => {
            await deleteUserSocketId(userId);
        });
    });

    return io;
};

export const sendToUser = async (
    io: ServerIO | null,
    userId: string,
    event: string,
    data: any
) => {
    const socketId = await getUserSocketId(userId);
    if (!io || !socketId) {
        return;
    }
    io.to(socketId).emit(event, data);
};
