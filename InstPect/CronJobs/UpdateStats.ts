import { getRepository } from 'typeorm';
import Request from 'request-promise';

import * as InstagramBaseModel from '../Models/InstagramBaseModel';

import InstagramAccount from '../Entities/InstagramAccount';
import InstagramStats from "../Entities/InstagramStats";
import { IgApiClient } from "instagram-private-api";

export default async function UpdateStats()
{
    try
    {
        let InstagramRepository = getRepository(InstagramAccount);
        let StatsRepository = getRepository(InstagramStats);

        let Accounts = await InstagramRepository.find({ relations: [ "stats" ] });

        for (let Account of Accounts)
        {
            let CurrentDate: Date = new Date();
            let CurrentMonth = CurrentDate.getUTCMonth() + 1;
            let CurrentDay = CurrentDate.getUTCDate();

            let Client: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);

            let User = await Client.account.currentUser();
            let UserInfo = await Client.user.info(User.pk);

            let FollowerCount = UserInfo.follower_count;
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
        }
    }
    catch(Error)
    {
        console.error(`Error (CRON UpdateStats): ${Error}`);
        return;
    }
}