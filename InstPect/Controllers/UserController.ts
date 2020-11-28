import { getRepository } from 'typeorm';
import { createHash } from 'crypto';

import * as UserModel from '../Models/UserModel';

import { APIStatus } from '../Middleware/APIMiddleware';
import User from '../Entities/User';

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

export async function ChangePassword(req, res, next) {
    try
    {
        let UserID = req.session.userid;
        let HashedPassword = createHash('sha1').update(req.body.currentpassword).digest();
        let NewPassword = createHash('sha1').update(req.body.newpassword).digest();

        await UserModel.ChangePassword(UserID, HashedPassword, NewPassword);

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        console.error(`Error (ChangePassword): ${Error}`);
        return next(new APIStatus(500));
    }
}