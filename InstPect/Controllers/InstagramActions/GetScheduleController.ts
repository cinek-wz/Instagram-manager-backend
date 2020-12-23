import { getRepository } from 'typeorm';

import InstagramPhoto from '../../Entities/InstagramPhoto';
import { APIStatus } from '../../Middleware/Main/APIMiddleware';

export default async function GetSchedule(req, res, next)
{
    try
    {
        let AccountID = req.query.accountid;

        let PhotoRepository = getRepository(InstagramPhoto);
        let Photos = await PhotoRepository.find({ where: { accountid: AccountID }, select: ["id", "photo", "date", "description"], order: { date: "ASC" } });

        return next(new APIStatus(200, Photos));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            default:
                return next(new APIStatus(500, Error));
        }
    }
}