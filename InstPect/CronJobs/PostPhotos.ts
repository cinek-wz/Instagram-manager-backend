import { getRepository, LessThanOrEqual } from 'typeorm';

import InstagramAccount from '../Entities/InstagramAccount';
import InstagramPhoto from '../Entities/InstagramPhoto';

import * as InstagramBaseModel from '../Models/InstagramBaseModel';

import { IgApiClient } from "instagram-private-api";

export default async function PostPhotos()
{
    try
    {
        let InstagramRepository = getRepository(InstagramAccount);
        let PhotoRepository = getRepository(InstagramPhoto);

        let CurrentTime: Date = new Date();

        let Photos = await PhotoRepository.find({ relations: ["account"], where: { date: LessThanOrEqual(CurrentTime) } });

        for (let Photo of Photos)
        {
            let Account: InstagramAccount = Photo.account;
            let Client: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);

            let Result;
            try
            {
                Result = await Client.publish.photo(
                {
                    file: Photo.photo,
                    caption: Photo.description,
                });
            }
            catch (Error)
            {
                console.error(Error);
            }

            await PhotoRepository.delete(Photo);
            if (Result.status != 'ok')
            {
                console.error(Result);
            }
        }
    }
    catch (Error)
    {
        console.error(`Error (CRON PostPhotos): ${Error}`);
        return;
    }
}