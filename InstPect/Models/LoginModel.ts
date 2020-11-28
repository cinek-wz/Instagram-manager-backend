import { getRepository } from "typeorm";
import { createHash } from "crypto";

import User from "../Entities/User";
import ErrorEx from "../Utils/Error";

export async function Register(Login: string, Password: string, Email: string)
{
    let Repository = getRepository(User);

    let Exists = await Repository.findOne({ where: [{ login: Login }, { email: Email }] });
    
    if(Exists == null)
    {
        let HashedPassword = createHash('sha1').update(Password).digest();
        console.log(`Hashed Password: ${HashedPassword}`)

        let NewUser = new User();
        NewUser.login = Login;
        NewUser.password = HashedPassword;
        NewUser.email = Email;

        await Repository.save(NewUser);
        return;
    }
    else
    {
        throw new ErrorEx(0);
    }
}

export async function Login(Login: string, Password: string) : Promise<Object>
{
    let Repository = getRepository(User);

    let HashedPassword = createHash('sha1').update(Password).digest();
    console.log(`Hashed Password: ${HashedPassword}`)

    let Account = await Repository.findOne({ select: ["id", "login", "role"], where: { login: Login, password: HashedPassword }});

    if(Account)
    {
        return Account;
    }
    else
    {
        throw new ErrorEx(0);
    }
}