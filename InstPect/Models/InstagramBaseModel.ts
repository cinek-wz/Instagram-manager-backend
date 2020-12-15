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
    catch (IgCheckpointError)
    {
        console.log(IgCheckpointError);
        await IGClient.challenge.auto(true);

        throw new ErrorEx(1, JSON.stringify(await IGClient.state.serialize()))
    }
}

export async function InstagramAccountAdd(UserID: number, Login: string, Password: string, InstagramID: number, Session: string): Promise<void>
{
    let InstagramRepository = getRepository(InstagramAccount);

    let AccountsCount = await InstagramRepository.count({ where: [{ instagramid: InstagramID }] });
    if (AccountsCount > 0)
    {
        throw new ErrorEx(0);
    }

    let NewAccount = new InstagramAccount();
    NewAccount.userid = UserID;
    NewAccount.login = Login;
    NewAccount.password = Password;
    NewAccount.instagramid = InstagramID;
    NewAccount.session = Session;

    await InstagramRepository.save(NewAccount);
}



export async function GetUserInstagramAccounts(UserID: number): Promise<Array<InstagramAccount>>
{
    let InstagramRepository = getRepository(InstagramAccount);
    return await InstagramRepository.find({ where: { userid: UserID, enabled: true } });
}

export async function GetInstagramAccount(Account: InstagramAccount): Promise<IgApiClient>
{
    let InstagramRepository = getRepository(InstagramAccount);

    try
    {
        let IGClient = new IgApiClient();
        IGClient.state.generateDevice("instpect");

        await IGClient.state.deserialize(Account.session);
        await IGClient.account.login(Account.login, Account.password);

        return IGClient;
    }
    catch (Error)
    {
        try
        {
            Account.enabled = false;
            await InstagramRepository.save(Account);
        }
        catch (Error)
        {
            throw new ErrorEx(1);
        }
    }
}