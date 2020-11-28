import { getRepository } from "typeorm";

import Redis from "../DB/Redis";
import ErrorEx from "../Utils/Error";

import { User } from "../Entities/User";

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