export const polygonApiToken = process.env.POLYGON_API_TOKEN;

export const sessionConfig = {
    cookieName: 'session',
    password: process.env.SESSION_PWD as string,
    // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

export const redisUrl = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export const storageFolder = '/tmp';
