import { createClient } from 'redis';
import { redisUrl } from '@/config';
import e from 'cors';

const client = createClient({
    url: redisUrl,
});
client.on('error', (err) => console.log('Redis Client Error', err));
client.connect();

export async function updateUserReport(
    userId: string,
    reportId: string,
    status: string
) {
    return await client.hSet(`${userId}:reports`, reportId, status);
}

export async function getUserReports(userId: string) {
    return await client.hGetAll(`${userId}:reports`);
}

export async function setUserSocketId(userId: string, socketId: string) {
    return await client.set(`${userId}:socketId`, socketId);
}

export async function getUserSocketId(userId: string) {
    return await client.get(`${userId}:socketId`);
}

export async function deleteUserSocketId(userId: string) {
    return await client.get(`${userId}:socketId`);
}
