import { APIStatus } from '../APIMiddleware';
import Redis from '../../DB/Redis';

export default async function RateLimitMiddleware(req, res, next)
{
    let IP = req.ip;
    let CurrentLimit = await Redis.get(`rate:${IP}`);

    if (CurrentLimit && (parseInt(CurrentLimit) > 40))
    {
        return next(new APIStatus(429));
    }
    else
    {
        if (CurrentLimit == null)
        {
            await Redis.set(`rate:${IP}`, '0');
            await Redis.expire(`rate:${IP}`, 60)
        }
        await Redis.incr(`rate:${IP}`);
        return next();
    }
}
