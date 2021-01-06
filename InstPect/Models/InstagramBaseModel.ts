import { getRepository } from "typeorm";
import { IgApiClient, IgCheckpointError, AccountFollowersFeed } from 'instagram-private-api';

import InstagramAccount from '../Entities/InstagramAccount';
import User from '../Entities/User';
import ErrorEx from "../Utils/Error";

export async function InstagramClientCodeVerification(Session, Code): Promise<{ session: string, id: number }>
{
    let IGClient = new IgApiClient();
    IGClient.state.generateDevice("instpect");

    try
    {
        await IGClient.state.deserialize(Session);
        await IGClient.challenge.sendSecurityCode(Code);

        let UserData = await IGClient.account.currentUser();

        return { session: JSON.stringify(await IGClient.state.serialize()), id: UserData.pk };
    }
    catch (Error)
    {
        throw new ErrorEx(2);
    }
}

export async function InstagramClientLogin(Login: string, Password: string): Promise<{ session: string, id: number }>
{
    let IGClient = new IgApiClient();
    IGClient.state.generateDevice("instpect");

    try
    {
        await IGClient.simulate.preLoginFlow();
        await IGClient.account.login(Login, Password);
        await IGClient.simulate.postLoginFlow();

        let UserData = await IGClient.account.currentUser();

        return { session: JSON.stringify(await IGClient.state.serialize()), id: UserData.pk };
    }
    catch (Error)
    {
        console.log(Error);
        await IGClient.challenge.auto(true);

        throw new ErrorEx(1, JSON.stringify(await IGClient.state.serialize()))
    }
}

export async function GetInstagramAccountClient(Account: InstagramAccount): Promise<IgApiClient>
{
    let InstagramRepository = getRepository(InstagramAccount);

    try
    {
        let IGClient = new IgApiClient();
        IGClient.state.generateDevice("instpect");

        await IGClient.state.deserialize(Account.session);
        //await IGClient.account.login(Account.login, Account.password);

        IGClient.request.end$.subscribe(async () =>
        {
            const Session = JSON.stringify(await IGClient.state.serialize());

            Account.session = Session;
            await InstagramRepository.save(Account);
        });

        return IGClient;
    }
    catch (Error)
    {
        Account.enabled = false;
        await InstagramRepository.save(Account);

        console.error(`Failed to login: ${Account.login}`);
        throw new ErrorEx(3, Error);
    }
}