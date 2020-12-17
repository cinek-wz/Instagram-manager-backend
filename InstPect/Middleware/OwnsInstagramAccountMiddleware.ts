import { getRepository } from 'typeorm';

import { APIStatus } from './APIMiddleware';
import InstagramAccount from '../Entities/InstagramAccount';

export default async function OwnsInstagramAccountMiddleware(req, res, next) 
{
    let UserID = req.session.userid;
    let AccountID = req.body.accountid;

    let InstagramRepository = getRepository(InstagramAccount);

    let Account: InstagramAccount = await InstagramRepository.findOne({ where: { id: AccountID, userid: UserID } });

    if(Account != null)
    {
        req.instagramaccount = Account;
        return next();
    }
    else
    {
        return next(new APIStatus(401));
    }
}