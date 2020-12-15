import * as InstagramModel from '../Models/InstagramModel';
import * as InstagramBaseModel from '../Models/InstagramBaseModel';

import { APIStatus } from '../Middleware/APIMiddleware';
import ErrorEx from '../Utils/Error';

export async function FindSimilarTags(req, res, next)
{
    try
    {
        let UserID = req.session.userid;
        let Tag = req.body.tag;

        let InstagramAccounts = await InstagramBaseModel.GetUserInstagramAccounts(UserID);
        if (InstagramAccounts.length == 0)
        {
            throw new ErrorEx(0);
        }

        let InstagramClient = await InstagramBaseModel.GetInstagramAccount(InstagramAccounts[0]);
        let SimilarTags = await InstagramModel.GetSimilarTags(InstagramClient, Tag);

        return next(new APIStatus(200, SimilarTags));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            //No Instagram accounts linked
            case 0:
                return next(new APIStatus(404));
            //Error with login to instagram Account
            case 1:
                return next(new APIStatus(403));
            //Error when gathering tags
            case 2:
                return next(new APIStatus(503));
            default:
                console.error(`Error (FindSimilarTags): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}