import { getRepository } from 'typeorm';
import { createHash } from 'crypto';
import { IgApiClient, IgCheckpointError, AccountFollowersFeed } from 'instagram-private-api';

//import * as InstagramModel from '../Models/InstagramModel';

import { APIStatus } from '../Middleware/APIMiddleware';

export async function FindSimilarTags(req, res, next)
{
    try
    {

    }
    catch (Error)
    {
        switch (Error.code)
        {
            //No Instagram accounts linked
            case 0:
                return next(new APIStatus(400));
            default:
                console.error(`Error (FindSimilarTags): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}