import fs from 'fs';
import { pipeline } from 'stream/promises';
import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import z, { ZodError } from 'zod';
import { sessionConfig, storageFolder } from '@/config';
import { getUserReports } from '@/external/redis';

const querySchema = z.object({
    reportId: z.string().min(1),
});

export default withIronSessionApiRoute(async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const query = querySchema.parse(req.query);
        const reports = await getUserReports(req.session.id as string);
        if (!(query.reportId in reports)) {
            return res.status(404).send({
                message: 'Such report does not exist',
            });
        }
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename=report.pdf');

        await pipeline(
            fs.createReadStream(`${storageFolder}/${query.reportId}.pdf`),
            res
        );
    } catch (e) {
        if (e instanceof ZodError) {
            return res.status(400).send({
                message: 'Bad payload',
                errors: e.errors,
            });
        }

        throw e;
    }
},
sessionConfig);
