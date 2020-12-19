import { getRepository } from 'typeorm';
import Request from 'request-promise';

import InstagramAccount from '../Entities/InstagramAccount';
import InstagramStats from "../Entities/InstagramStats";

export default async function UpdateStats()
{
    try
    {
        let InstagramRepository = getRepository(InstagramAccount);
        let StatsRepository = getRepository(InstagramStats);

        let AllAccounts = await InstagramRepository.find({ relations: [ "stats" ] });

        for (let i = 0; i < AllAccounts.length; i++)
        {
            let Account: InstagramAccount = AllAccounts[i];
            let CurrentDate: Date = new Date();
            let CurrentMonth = CurrentDate.getUTCMonth() + 1;
            let CurrentDay = CurrentDate.getUTCDate();

            let Data = await Request.get(`https://www.instagram.com/graphql/query/?query_hash=c76146de99bb02f6415203be841dd25a&variables={"id":"${Account.instagramid}","first":0}`, { json: true });

            let FollowerCount = Data.data.user.edge_followed_by.count;

            if (Account.stats.monthcheck != CurrentMonth)
            {
                Account.stats.monthfollowers = FollowerCount;
                Account.stats.monthcheck = CurrentMonth;
            }
            if (Account.stats.daycheck != CurrentDay)
            {
                Account.stats.dayfollowers = FollowerCount;
                Account.stats.daycheck = CurrentDay;
            }
            Account.stats.currentfollowers = FollowerCount;

            await StatsRepository.save(Account.stats);
            return;
        }
    }
    catch(Error)
    {
        console.error(`Error (CRON UpdateStats): ${Error}`);
        return;
    }
}