import * as UserModel from '../Models/UserModel';

import { APIStatus } from '../Middleware/APIMiddleware';

export async function GetProfile(req, res, next)
{
    try
    {
        let UserID = req.session.userid;
        let Profile = await UserModel.GetUserProfile(UserID);

        return next(new APIStatus(200, Profile));
    }
    catch(Error)
    {
        console.error(`Error (GetProfile): ${Error}`);
        return next(new APIStatus(500));
    }
}