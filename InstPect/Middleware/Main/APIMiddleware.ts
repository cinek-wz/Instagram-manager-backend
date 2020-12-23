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
    return async function(result: APIStatus, req, res, next) 
    {
        if (result.status == 500)
        {
            console.error(`Error (${req.method}} ${req.path}: ${result.data.toString()}`);
            res.status(result.status).send();
        }
        else
        {
            res.status(result.status).send((result.data != null) ? { data: result.data } : null);
        }

        return next(result.data);
    }
}