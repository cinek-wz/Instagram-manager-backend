import { getRepository } from 'typeorm';

import InstagramPhoto from '../../Entities/InstagramPhoto';
import { APIStatus } from '../../Middleware/Main/APIMiddleware';
import ErrorEx from "../../Utils/Error";

export default async function GetSchedule(req, res, next)
{
    try
    {
        let ScheduleID = req.body.scheduleid;
        let AccountID = req.body.accountid;

        let PhotoRepository = getRepository(InstagramPhoto);
        let Photo = await PhotoRepository.findOne({ where: { id: ScheduleID, accountid: AccountID } });

        if (Photo == null)
        {
            throw new ErrorEx(0);
        }

        await PhotoRepository.delete(Photo);
        return next(new APIStatus(200));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            // Unauthorized
            case 0:
                return next(new APIStatus(401));
            default:
                return next(new APIStatus(500, Error));
        }
    }
}