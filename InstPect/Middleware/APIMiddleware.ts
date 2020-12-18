import Redis from "../DB/Redis";

export class APIStatus
{
    public status: number;
    public data: any;

    constructor(status: number, data?: any)
    {
        this.status = status;
        this.data = data;
    }
}

export function APIMiddleware() 
{
    return async function(result: APIStatus, req, res, next) 
    {
        //Cache
        if (result.status == 200 && req.cache != null)
        {
            await Redis.set(req.cache, result.data);
            await Redis.expire(req.cache, req.cacheexpire);

            console.log(`Cached at ${req.cache} TX: ${req.cacheexpire}`);
        }

        res.status(result.status).send((result.data != null) ? { data: result.data } : null);
        return next();
    }
}