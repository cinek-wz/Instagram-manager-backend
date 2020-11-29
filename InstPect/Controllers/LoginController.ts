import * as LoginModel from '../Models/LoginModel';

import { APIStatus } from '../Middleware/APIMiddleware';

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
        let NewPassword = req.body.newpassword;
        let Secret = req.body.secret;

        if (Email != null)
        {
            await LoginModel.RecoveryCreateSecret(Email);
        }
        else
        {
            await LoginModel.RecoveryChangePassword(Secret, NewPassword);
        }

        return next(new APIStatus(200));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            //Account does not exists
            case 0:
                return next(new APIStatus(404));
            //Invalid Secret
            case 1:
                return next(new APIStatus(403));
            default:
                console.error(`Error (RecoverPassword): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}

export async function Logout(req, res, next)
{
    req.session.destroy((Error) =>
	{
        return next(new APIStatus(200));
	});
}