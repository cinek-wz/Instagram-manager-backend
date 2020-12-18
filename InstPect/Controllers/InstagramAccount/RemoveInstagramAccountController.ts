import { getRepository } from 'typeorm';

import { APIStatus } from '../../Middleware/APIMiddleware';
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
        console.error(`Error (RemoveAccount): ${Error}`);
        return next(new APIStatus(500));
    }
}