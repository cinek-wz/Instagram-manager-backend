import { validationResult } from 'express-validator/check';
import { APIStatus } from '../APIMiddleware';

export default async function UserInputMiddleware(req, res, next) 
{
    if(validationResult(req).isEmpty())
    {
        return next();
    }
    else
    {
        return next(new APIStatus(400));
    }
}