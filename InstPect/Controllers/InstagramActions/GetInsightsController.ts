import * as InstagramBaseModel from '../../Models/InstagramBaseModel';

import InstagramAccount from '../../Entities/InstagramAccount';
import { APIStatus } from '../../Middleware/Main/APIMiddleware';
import ErrorEx from '../../Utils/Error';
import { IgApiClient } from 'instagram-private-api';


export default async function GetInsights(req, res, next)
{
    try
    {
        let Account: InstagramAccount = req.instagramaccount;
        let InstagramClient: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);

        let Insights = await InstagramClient.insights.account({
            gridMediaSize: 256,
            contentTab: true,
            activityTab: true,
            audienceTab: true,
        });

        let BusinessAccount: boolean = Insights.data.user.business_profile != null;

        return next(new APIStatus(200,
            {
                business: BusinessAccount,
                data: (BusinessAccount == true) ? Insights.data.user.business_manager.followers_unit.days_hourly_followers_graphs: null
            }));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            default:
                return next(new APIStatus(500, Error));
        }
    }
}