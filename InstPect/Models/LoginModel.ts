import { getRepository } from "typeorm";
import { createHash, randomBytes } from "crypto";
import { createTransport } from 'nodemailer';

import Redis from '../DB/Redis';
import { SMTP } from '../Config';

import User from "../Entities/User";
import ErrorEx from "../Utils/Error";

export async function Register(Login: string, Password: string, Email: string): Promise<void>
{
    let Repository = getRepository(User);

    let Exists = await Repository.findOne({ where: [{ login: Login }, { email: Email }] });
    
    if(Exists == null)
    {
        let HashedPassword = createHash('sha1').update(Password).digest();

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

export async function RecoveryCreateSecret(Email: string): Promise<void>
{
    let Repository = getRepository(User);
    let Account = await Repository.findOne({ select: ["id"], where: { email: Email } });

    if (Account == null)
    {
        throw new ErrorEx(0);
    }

    let Secret = createHash('sha512').update(`${Email}${randomBytes(20).toString('hex')}`).digest('hex');

    //Send email
    let transporter = createTransport(SMTP);
    await transporter.sendMail({
        from: '"InstPect" test@instpect.pl',
        to: Email,
        subject: 'InstPect - Password Recovery',
        text: `https://instpect.pl/recovery/${Secret}`,

    });

    //Setup recovery secret to database
    await Redis.set(`recovery:${Secret}`, `${Account.id}`);
    await Redis.expire(`recovery:${Secret}`, 3600);
}

export async function RecoveryChangePassword(Secret: string, NewPassword: string)
{
    let UserID = await Redis.get(`recovery:${Secret}`);
    if (UserID == null)
    {
        throw new ErrorEx(1);
    }

    let Repository = getRepository(User);
    let Account = await Repository.findOne({ select: ["id"], where: { id: UserID } });

    Account.password = createHash('sha1').update(NewPassword).digest();

    await Repository.save(Account);
    await Redis.del(`recovery:${Secret}`);
}