import type { NextApiRequest, NextApiResponse } from 'next';
import z, { ZodError, ZodIssue } from 'zod';
import { getBars } from '@/external/polygon-service';
import { AggregatedBarData } from '@/types';

const querySchema = z.object({
    ticker: z.string().min(1),
    duration: z.enum(['week', 'month', 'year']),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<
        AggregatedBarData | { message: string; errors?: ZodIssue[] }
    >
) {
    try {
        const query = querySchema.parse(req.query);

        const data = await getBars({
            ticker: query.ticker,
            duration: query.duration,
        });

        res.status(200).json(data);
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).send({
                message: 'Bad payload',
                errors: e.errors,
            });
        }

        throw e;
    }
}
