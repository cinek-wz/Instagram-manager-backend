import Redis from "../../DB/Redis";

export class APIStatus
{
    public status: number;
    public data: any;

    constructor(status: number, data?: any)
    {
        this.status = status;
        this.data = data;
    }
}

export function APIMiddleware() 
{
    return async function(Result: APIStatus, req, res, next) 
    {
        if (Result.status == 500)
        {
            console.error(`Error (${req.method}} ${req.path}: ${Result.data}`);
            res.status(Result.status).send();
        }
        else
        {
            res.status(Result.status).send((Result.data != null) ? { data: Result.data } : null);
        }

        return next(Result);
    }
}