import "reflect-metadata";
import { createConnection, ConnectionOptions } from 'typeorm';
import Express from 'express';
import ExpressSession from 'express-session';
import Compression from 'compression';
import History from 'connect-history-api-fallback';
import ConnectRedis = require('connect-redis');

import { DB as Config } from './Config';
import Redis from './DB/Redis';

import LoginRoute from './Routes/LoginRoute';
import UserRoute from './Routes/UserRoute';
import InstagramRoute from './Routes/InstagramRoute';
import InstagramBaseRoute from './Routes/InstagramBaseRoute';

import { APIMiddleware } from './Middleware/APIMiddleware';
import RateLimitMiddleware from "./Middleware/RateLimitMiddleware";

var RedisStore = ConnectRedis(ExpressSession);
const app = Express();

app.set('trust proxy', true);
app.disable('x-powered-by');

app.use(History());
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

app.use(LoginRoute);
app.use(InstagramRoute);
app.use(InstagramBaseRoute);
app.use(UserRoute);

app.use(APIMiddleware());

createConnection(Config.SQL as ConnectionOptions).then(async (Connection) =>
{
    app.listen(3000, () => { console.log("Listening"); });
}).catch(Error => {
    console.error(`Database connection error: ${Error}`);
});
