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
    return function(result: APIStatus, req, res, next) 
    {
        res.status(result.status).send((result.data != null) ? { data: result.data } : null);
        return next();
    }
}