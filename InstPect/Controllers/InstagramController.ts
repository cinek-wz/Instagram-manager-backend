import * as InstagramModel from '../Models/InstagramModel';
import * as InstagramBaseModel from '../Models/InstagramBaseModel';

import { APIStatus } from '../Middleware/APIMiddleware';
import ErrorEx from '../Utils/Error';
import InstagramAccount from '../Entities/InstagramAccount';
import { IgApiClient } from 'instagram-private-api';

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

        let InstagramClient = await InstagramBaseModel.GetInstagramAccountClient(InstagramAccounts[0]);
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

export async function GetInsights(req, res, next)
{
    try
    {
        let UserID = req.session.userid;
        let AccountID = req.body.accountid;

        let Account: InstagramAccount = await InstagramBaseModel.GetInstagramAccountByID(UserID, AccountID);
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
                console.error(`Error (GetInsights): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}