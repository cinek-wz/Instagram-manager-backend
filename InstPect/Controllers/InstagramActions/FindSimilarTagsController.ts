import * as InstagramBaseModel from '../../Models/InstagramBaseModel';

import { APIStatus } from '../../Middleware/Main/APIMiddleware';
import ErrorEx from '../../Utils/Error';
import InstagramAccount from '../../Entities/InstagramAccount';
import { IgApiClient } from "instagram-private-api";

export default async function FindSimilarTags(req, res, next) 
{
    try
    {
        let Tag = req.query.tag;
        console.log('Tag: ' + Tag);
        let InstagramAccount: InstagramAccount = req.instagramaccount;

        let InstagramClient: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(InstagramAccount);

        let tags = await InstagramClient.feed.tags(Tag, "top");
        await tags.request();
        let Items = await tags.items();

        // array
        let Collection: Array<{ tag: string, count: number }> = [];

        for (let Item of Items) {
            if (Item.caption == null) continue;
            let Match = Item.caption.text.match(/(#.*?)(?= |#|\n|$)/gm);
            if (Match == null) continue;

            for (let Tag of Match) {
                let Existing = Collection.findIndex((element) => element.tag == Tag);

                if (Existing == -1) {
                    Collection.push({ tag: Tag, count: 1 });
                }
                else {
                    Collection[Existing].count += 1;
                }
            }
        }
        Collection = Collection.sort((a, b) => (a.count - b.count < 0) ? 1 : -1);
        Collection = Collection.slice(0, 30);

        return next(new APIStatus(200, Collection));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            //Error with login to instagram Account
            case 1:
                return next(new APIStatus(403));
            //Error when gathering tags
            case 2:
                return next(new APIStatus(503));
            default:
                return next(new APIStatus(500, Error));
        }
    }
}