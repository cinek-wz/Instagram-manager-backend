import Redis from '../../DB/Redis';

import { APIStatus } from "./APIMiddleware";

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
            req.cache = { name: CacheName, expire: ExpireTime };
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
    return async function (Result: APIStatus, req, res, next)
    {
        try
        {
            if (res.statusCode == 200 && req.cache != null)
            {
                const Data = JSON.stringify(Result.data, null, 2);

                await Redis.set(req.cache.name, Data);
                await Redis.expire(req.cache.name, req.cache.expire);

                console.log(`Cache created ${req.cache.name}`);
            }
        }
        catch (Error)
        {
            console.error(`Failed to create cache ${req.cache.name} ${Error.toString()}`);
        }
        return next();
    }
}