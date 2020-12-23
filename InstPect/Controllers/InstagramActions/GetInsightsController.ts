import * as InstagramModel from '../../Models/InstagramModel';
import * as InstagramBaseModel from '../../Models/InstagramBaseModel';

import InstagramAccount from '../../Entities/InstagramAccount';
import { APIStatus } from '../../Middleware/APIMiddleware';
import ErrorEx from '../../Utils/Error';
import { IgApiClient } from 'instagram-private-api';


export default async function GetInsights(req, res, next)
{
    try
    {
        let Account: InstagramAccount = req.instagramaccount;

        let InstagramClient: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);
        let Insights = await InstagramModel.GetInsights(InstagramClient);

        return next(new APIStatus(200, Insights));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            //Account is not owned by user
            case 0:
                return next(new APIStatus(403));
            //Instagram account is not business account
            case 1:
                return next(new APIStatus(400));
            default:
                return next(new APIStatus(500, Error));
        }
    }
}