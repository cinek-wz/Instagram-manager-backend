import { getRepository } from 'typeorm';

import { APIStatus } from '../../Middleware/APIMiddleware';
import InstagramAccount from '../../Entities/InstagramAccount';
import InstagramStats from "../../Entities/InstagramStats";

export default async function GetAccounts(req, res, next)
{
    try
    {
        let UserID = req.session.userid;

        let InstagramRepository = getRepository(InstagramAccount);

        let Accounts: Array<InstagramAccount> = await InstagramRepository.createQueryBuilder('account')
            .leftJoinAndSelect('account.stats', 'stats')
            .where("account.userid = :userid", { userid: UserID })
            .select(["account.id as id", "account.login as login", "account.password as password", "account.enabled as enabled", "stats.monthfollowers as monthfollowers", "stats.dayfollowers as dayfollowers", "stats.currentfollowers as currentfollowers"])
            .getRawMany();

        return next(new APIStatus(200, Accounts));
    }
    catch (Error)
    {
        console.error(`Error (GetAccounts): ${Error}`);
        return next(new APIStatus(500));
    }
}