import { getRepository } from "typeorm";

import InstagramAccount from '../Entities/InstagramAccount';
import User from '../Entities/User';
import ErrorEx from "../Utils/Error";

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

export async function InstagramAccountAdd(UserID: number, Login: string, Password: string, Session: string): Promise<void>
{
    let InstagramRepository = getRepository(InstagramAccount);
    let UserRepository = getRepository(User);

    let AccountOwner: User = await UserRepository.findOne({ where: [{ id: UserID }] });

    let NewAccount = new InstagramAccount();
    NewAccount.user = AccountOwner;
    NewAccount.login = Login;
    NewAccount.password = Password;
    NewAccount.session = Session;

    await InstagramRepository.save(NewAccount);
}