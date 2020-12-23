import { APIStatus } from '../APIMiddleware';

export default async function LoggedInMiddleware(req, res, next) 
{
    if(req.session.userid)
    {
        return next();
    }
    else
    {
        return next(new APIStatus(401));
    }
}