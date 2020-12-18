import Redis from '../DB/Redis';

import { APIStatus } from '../Middleware/APIMiddleware';

export default function CacheMiddleware(ExpireTime: number, Name: string, Options?: Array<{ type: "body" | "params" | "query", name: string }> | { type: "body" | "params" | "query", name: string })
{
    return async function (req, res, next)
    {
        let CacheName;

        if (Options == null)
        {
            CacheName = `cache:${Name}`;
        }
        else if(Array.isArray(Options))
        {
            let NameBuild = "";
            for (let i = 0; i < Options.length;i++)
            {
                NameBuild += req[Options[i].type][Options[i].name] + (i == (Options.length-1) ? "" : ":");
            }
            CacheName = `cache:${Name}:${NameBuild}`;
        }
        else
        {
            CacheName = `cache:${Name}:${req[Options.type][Options.name]}`;
        }

        let Cache = await Redis.get(CacheName);

        if (Cache == null)
        {
            req.cache = CacheName;
            req.cacheexpire = ExpireTime;
            return next();
        }
        else
        {
            return next(new APIStatus(200, Cache));
        }
    }
}