import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getIronSession } from 'iron-session/edge';
import { sessionConfig } from '@/config';

declare module 'iron-session' {
    interface IronSessionData {
        id?: string;
        reports?: string[];
    }
}

export const middleware = async (req: NextRequest) => {
    const res = NextResponse.next();
    const session = await getIronSession(req, res, sessionConfig);

    if (!session.id) {
        session.id = uuidv4();
        await session.save();
    }

    return res;
};

export const config = {
    matcher: '/api/:path*',
};
