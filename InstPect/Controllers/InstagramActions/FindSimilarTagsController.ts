import * as InstagramModel from '../../Models/InstagramModel';
import * as InstagramBaseModel from '../../Models/InstagramBaseModel';


import { APIStatus } from '../../Middleware/APIMiddleware';
import ErrorEx from '../../Utils/Error';
import InstagramAccount from '../../Entities/InstagramAccount';

export default async function FindSimilarTags(req, res, next) 
{
    try
    {
        let Tag = req.body.tag;
        let InstagramAccount: InstagramAccount = req.instagramaccount;

        let InstagramClient = await InstagramBaseModel.GetInstagramAccountClient(InstagramAccount);
        let SimilarTags = await InstagramModel.GetSimilarTags(InstagramClient, Tag);

        return next(new APIStatus(200, SimilarTags));
    }
    catch (Error)
    {
        switch (Error.code)
        {
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