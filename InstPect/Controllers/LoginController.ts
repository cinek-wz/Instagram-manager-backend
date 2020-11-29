import { createHash, randomBytes } from "crypto";
import { createTransport } from 'nodemailer';

import * as LoginModel from '../Models/LoginModel';

import { APIStatus } from '../Middleware/APIMiddleware';
import Redis from '../DB/Redis';
import { SMTP } from '../Config';

export async function Register(req, res, next)
{
    try
    {
        await LoginModel.Register(req.body.login, req.body.password, req.body.email);
        
        return next(new APIStatus(200));
    }
    catch(Error)
    {
        switch(Error.code)
        {
            //User already exists
            case 0:
                return next(new APIStatus(409));
            default:
                console.error(`Error (Register): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}

export async function Login(req, res, next)
{
    try
    {
        let Account: any = await LoginModel.Login(req.body.login, req.body.password);

        if(Account)
        {
            req.session.userid = Account.id;

            return next(new APIStatus(200, { login: Account.login, credits: Account.credits, role: Account.role }));
        }
    }
    catch(Error)
    {
        switch (Error.code)
        {
            //Invalid login or password
            case 0:
                return next(new APIStatus(401));
            default:
                console.error(`Error (Login): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}

export async function RecoverPassword(req, res, next)
{
    try
    {
        let Email = req.body.email;
        let Password = req.body.newpassword;

        if (req.body.email != null)
        {
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
            await Redis.set(`recovery:${Secret}`, `${Email}`);
            await Redis.expire(`recovery:${Secret}`, 3600)
        }
        else
        {

        }

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        console.error(`Error (RecoverPassword): ${Error}`);
        return next(new APIStatus(500));
    }
}

export async function Logout(req, res, next)
{
    req.session.destroy((Error) =>
	{
        return next(new APIStatus(200));
	});
}