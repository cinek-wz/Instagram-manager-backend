import * as InstagramBaseModel from '../Models/InstagramBaseModel';

import { APIStatus } from '../Middleware/APIMiddleware';

export default async function AddAccount(req, res, next)
{
    try
    {
        let UserID = req.session.userid;
        let Code = req.body.code;
        let Login = req.body.login;
        let Password = req.body.password;

        let Data: { session: string, id: number };

        if (Login != null && Password != null)
        {
            req.session.igaddstate = null;
            Data = await InstagramBaseModel.InstagramClientLogin(Login, Password);
        }
        else
        {
            Data = await InstagramBaseModel.InstagramClientCodeVerification(req.session.igaddstate, Code);
            req.session.igaddstate = null;
        }
        await InstagramBaseModel.InstagramAccountAdd(UserID, Login, Password, Data.id, Data.session);
        return next(new APIStatus(200));
    }
    catch(Error)
    {
        switch (Error.code) {
            //Account already exists
            case 0:
                return next(new APIStatus(409));
            //Account requires code verification from email
            case 1:
                req.session.igaddstate = Error.data;
                return next(new APIStatus(100));
            //Account could not resolve checkpoint code
            case 2:
                return next(new APIStatus(400));
            default:
                console.error(`Error (AddAccount): ${Error}`);
                return next(new APIStatus(500));
        }

    }
}

