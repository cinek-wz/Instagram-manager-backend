import { getRepository } from 'typeorm';

import { APIStatus } from '../../Middleware/APIMiddleware';
import InstagramAccount from '../../Entities/InstagramAccount';


export default async function ChangeStatus(req, res, next)
{
    try
    {
        let Status = req.body.status;
        let Account: InstagramAccount = req.instagramaccount;

        let InstagramRepository = getRepository(InstagramAccount);
        Account.enabled = Status;
        await InstagramRepository.save(Account);

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        return next(new APIStatus(500, Error));
    }
}