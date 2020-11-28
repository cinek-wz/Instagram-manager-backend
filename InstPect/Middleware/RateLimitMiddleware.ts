import { APIStatus } from '../Middleware/APIMiddleware';

export default async function RateLimitMiddleware(req, res, next)
{
    return next();
}
