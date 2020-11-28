import { getRepository } from "typeorm";

import Redis from "../DB/Redis";
import ErrorEx from "../Utils/Error";

import User from "../Entities/User";

export async function GetUserProfile(UserID: string) : Promise<Object>
{
    let Repository = getRepository(User);
    let Account = await Repository.findOne({ where: { id: UserID }} );

    if(Account)
    {
        return { login: Account.login, role: Account.role };
    }
    else
    {
        throw new Error();
    }
}

export async function ChangePassword(UserID: number, Password: Buffer, NewPassword: Buffer): Promise<void>
{
    let Repository = getRepository(User);
    let Account: User = await Repository.findOne({ select: ["id"], where: { id: UserID, password: Password } });

    if (Account)
    {
        Account.password = NewPassword;
        await Repository.save(Account);
    }
    else
    {
        throw new Error();
    }
}