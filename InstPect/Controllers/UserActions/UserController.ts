import { getRepository } from 'typeorm';
import { createHash } from 'crypto';

import * as UserModel from '../../Models/UserModel';

import { APIStatus } from '../../Middleware/APIMiddleware';
import User from '../../Entities/User';

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
        return next(new APIStatus(500, Error));
    }
}

export async function ChangePassword(req, res, next)
{
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
        switch (Error.code)
        {
            //Current password is wrong
            case 0:
                return next(new APIStatus(401));
            default:
                return next(new APIStatus(500, Error));
        }
    }
}

export async function ModifyProfile(req, res, next)
{
    try
    {
        let UserID = req.session.userid;

        //New profile data
        let NewEmail = req.body.email;

        await UserModel.ModifyProfile(UserID, NewEmail);

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        return next(new APIStatus(500, Error));
    }
}