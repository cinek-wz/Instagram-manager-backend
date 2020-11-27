import { getRepository } from "typeorm";
import { User } from "../DB/Entities/Users";
import ErrorEx from "../Utils/Error";

export async function Register(Login: string, Password: string, Email: string)
{
    let Repository = getRepository(User);

    let Exists = await Repository.findOne({ where: [{ login: Login }, { email: Email }] });
    
    if(Exists == null)
    {
        let NewUser = new User();
        NewUser.login = Login;
        NewUser.password = Password;
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
    let Account = await Repository.findOne({ select: ["id", "login", "credits", "role"], where: { login: Login, password: Password }});

    if(Account)
    {
        return Account;
    }
    else
    {
        throw new ErrorEx(0);
    }
}