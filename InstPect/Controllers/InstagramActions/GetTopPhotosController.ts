import * as InstagramBaseModel from '../../Models/InstagramBaseModel';

import { IgApiClient } from 'instagram-private-api';

import InstagramAccount from '../../Entities/InstagramAccount';
import { APIStatus } from '../../Middleware/APIMiddleware';
import ErrorEx from '../../Utils/Error';

export default async function GetTopPhotos(req, res, next)
{
    try
    {
        //let Account: InstagramAccount = req.instagramaccount;
        //let InstagramClient: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            default:
                console.error(`Error (GetTopPhotos): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}