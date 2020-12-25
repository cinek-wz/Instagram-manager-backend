import { getRepository } from 'typeorm';

import { APIStatus } from '../../Middleware/Main/APIMiddleware';
import InstagramAccount from '../../Entities/InstagramAccount';


export default async function RemoveAccount(req, res, next)
{
    try
    {
        let Account: InstagramAccount = req.instagramaccount;

        let InstagramRepository = getRepository(InstagramAccount);
        await InstagramRepository.remove(Account);

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        return next(new APIStatus(500, Error));
    }
}