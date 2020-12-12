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
        await IGClient.challenge.auto(true);

        throw new ErrorEx(1, JSON.stringify(await IGClient.state.serialize()))
    }
}

export async function InstagramAccountExists(Login: string): Promise<void>
{
    let InstagramRepository = getRepository(InstagramAccount);
    let Account = await InstagramRepository.findOne({ where: [{ login: Login }] });
    if (Account == null)
    {
        return;
    }
    else {
        throw new ErrorEx(0);
    }
}

export async function InstagramAccountAdd(UserID: number, Login: string, Password: string, InstagramID: number, Session: string): Promise<void>
{
    let InstagramRepository = getRepository(InstagramAccount);
    let UserRepository = getRepository(User);

    let AccountOwner: User = await UserRepository.findOne({ where: [{ id: UserID }] });

    let NewAccount = new InstagramAccount();
    NewAccount.user = AccountOwner;
    NewAccount.login = Login;
    NewAccount.password = Password;
    NewAccount.instagramid = InstagramID;
    NewAccount.session = Session;

    await InstagramRepository.save(NewAccount);
}