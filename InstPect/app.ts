import "reflect-metadata";
import "console-info";
import "console-warn";
import "console-error";
import fs from "fs";
import { createConnection, ConnectionOptions } from 'typeorm';
import Express from 'express';
import ExpressSession from 'express-session';
import Compression from 'compression';
import ConnectRedis = require('connect-redis');

import { DB as Config } from './Config';
import Redis from './DB/Redis';
import CronRunner from './Utils/CronRunner';

import UpdateStats from './CronJobs/UpdateStats';
import PostPhotos from './CronJobs/PostPhotos';

import GuestRoute from './Routes/GuestRoute';
import UserRoute from './Routes/UserRoute';
import InstagramRoute from './Routes/InstagramRoute';

import { APIMiddleware } from './Middleware/Main/APIMiddleware';
import RateLimitMiddleware from "./Middleware/Main/RateLimitMiddleware";
import { CacheAddMiddleware } from './Middleware/Main/CacheMiddleware';

var RedisStore = ConnectRedis(ExpressSession);
const app = Express();

app.set('trust proxy', true);
app.disable('x-powered-by');

app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(ExpressSession(
    {
        store: new RedisStore({ client: Redis.redis }),
        name: 'sid',
        secret: 'instect129832@!#@!',
        cookie:
        {
            secure: (process.env.NODE_ENV == "debug" ? false : true),
            maxAge: 3600000
        },
        proxy: true,
        saveUninitialized: false,
        resave: false
    }));

app.use(Compression());
app.use(RateLimitMiddleware);
app.use(Express.static('public'));

app.use(GuestRoute);
app.use(InstagramRoute);
app.use(UserRoute);

app.use(APIMiddleware());
app.use(CacheAddMiddleware());

createConnection(Config.SQL as ConnectionOptions).then(async (Connection) =>
{
    app.listen(3000, () =>
    {
        console.log("Listening");

        // Update account stats every 15 minutes
        let StatsRunner = new CronRunner('*/15 * * * *', UpdateStats);

        // Check new photos to post from schedule every minute
        let ScheduleRunner = new CronRunner('* * * * *', PostPhotos);
    });
}).catch(Error => {
    console.error(`Database connection error: ${Error}`);
});
