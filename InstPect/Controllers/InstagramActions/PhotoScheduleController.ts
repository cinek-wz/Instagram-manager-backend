import { getRepository } from 'typeorm';

import { APIStatus } from '../../Middleware/Main/APIMiddleware';
import InstagramPhoto from '../../Entities/InstagramPhoto';

export default async function UploadPhotoSchedule(req, res, next)
{
    try
    {
        let AccountID = req.body.accountid;
        let DateTime = req.body.date;
        let Description = req.body.description;
        let file = req.file;

        let PhotoRepository = getRepository(InstagramPhoto);

        let Photo = new InstagramPhoto();
        Photo.accountid = AccountID;
        Photo.date = new Date(DateTime);
        Photo.description = Description;
        Photo.photo = file.buffer;

        await PhotoRepository.save(Photo);
        return next(new APIStatus(200));
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