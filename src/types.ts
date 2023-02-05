import { Server as NetServer, Socket } from 'net';
import { NextApiResponse } from 'next';
import { Server as SocketIOServer } from 'socket.io';

export type NextApiResponseServerIO<T> = NextApiResponse<T> & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};

export type Ticker = {
    cik: string;
    currency_name: string;
    locale: string;
    name: string;
    primary_exchange: string;
    ticker: string;
};

export type BarData = {
    c: number;
    h: number;
    l: number;
    o: number;
    t: number;
};

export type AggregatedBarData = {
    minPrice: number;
    maxPrice: number;
    priceRange: number;
    startTimestamp: number;
    endTimestamp: number;
    timestampRange: number;
    bars: BarData[];
};
