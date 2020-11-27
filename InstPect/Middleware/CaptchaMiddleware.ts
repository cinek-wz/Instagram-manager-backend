import * as Request from 'request';
import { Captcha } from '../Config';
import { APIStatus } from '../Middleware/APIMiddleware';

export default async function CaptchaMiddleware(req, res, next) 
{
    if(Captcha.Enabled == false)
    {
        return next();
    }
    else
    {
        Request.post(`https://www.google.com/recaptcha/api/siteverify`, { json: true, form: { secret: Captcha.SecretKey, response: req.body.captcha }}, (Error, Response, Body) => 
        {
            if(Error)
            {
                return next(new APIStatus(500));
            }
            else
            {
                if(Body.success && Body.success == true)
                {
                    return next();
                }
                else
                {
                    return next(new APIStatus(400, "Nieprawidłowa Captcha."));
                }
            }
        });
    }
}
  