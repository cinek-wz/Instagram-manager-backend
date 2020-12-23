import Redis from '../../DB/Redis';

import { APIStatus } from '../APIMiddleware';

export function CacheMiddleware(ExpireTime: number, Name: string, Options?: Array<{ type: "body" | "params" | "query", name: string }> | { type: "body" | "params" | "query", name: string })
{
    return async function (req, res, next)
    {
        let CacheName = `cache:${Name}`;

        if(Array.isArray(Options))
        {
            let NameBuild = "";
            for (let i = 0; i < Options.length;i++)
            {
                NameBuild += req[Options[i].type][Options[i].name] + (i == (Options.length-1) ? "" : ":");
            }
            CacheName += `:${NameBuild}`;
        }
        else
        {
            CacheName = `:${req[Options.type][Options.name]}`;
        }

        // Create new cache if not found
        let Cache = await Redis.get(CacheName);
        if (Cache == null)
        {
            req.cache = CacheName;
            req.cacheexpire = ExpireTime;
            return next();
        }
        else
        {
            let CacheData = JSON.parse(Cache);
            return next(new APIStatus(200, CacheData));
        }
    }
}

export function CacheAddMiddleware()
{
    return async function (Data: Object, req, res, next)
    {
        try
        {
            if (Data != null && res.statusCode == 200 && req.cache != null) {
                await Redis.set(req.cache, JSON.stringify(Data));
                await Redis.expire(req.cache, req.cacheexpire);

                console.log(`Cache created ${req.cache}`);
            }
        }
        catch (Error)
        {
            console.error(`Failed to create cache ${req.cache} ${Error.toString()}`);
        }
        return next();
    }
}