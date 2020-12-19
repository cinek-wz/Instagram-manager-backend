import * as InstagramBaseModel from '../../Models/InstagramBaseModel';

import { IgApiClient } from 'instagram-private-api';

import InstagramAccount from '../../Entities/InstagramAccount';
import { APIStatus } from '../../Middleware/APIMiddleware';
import ErrorEx from '../../Utils/Error';

export default async function GetTopPhotos(req, res, next)
{
    try
    {
        let Account: InstagramAccount = req.instagramaccount;
        let InstagramClient: IgApiClient = await InstagramBaseModel.GetInstagramAccountClient(Account);

        let User = await InstagramClient.account.currentUser();
        let ID = User.pk;

        let Feed = InstagramClient.feed.user(ID);


        let Photos = [];

        do
        {
            let Items = await Feed.items();
            for (let i = 0; i < Items.length; i++)
            {
                let Item = Items[i];
                
                let ItemData = { time: Item.taken_at, comments: Item.comment_count, likes: Item.like_count, description: (Item.caption != null ? Item.caption.text : null), photo: null };
                if (Item.carousel_media == null)
                {
                    ItemData.photo = Item.image_versions2.candidates[0].url;
                }
                else
                {
                    ItemData.photo = Item.carousel_media[0].image_versions2.candidates[0].url;
                }
                Photos.push(ItemData);
            }
        }
        while (Feed.isMoreAvailable())

        Photos = Photos.sort((a, b) => {
            if (a.likes - b.likes < 0)
                return 1;
            if (a.likes - b.likes > 0)
                return -1;
            return 0;
        });
        Photos = Photos.slice(0, 3);

        return next(new APIStatus(200, Photos));
    }
    catch (Error)
    {
        switch (Error.code)
        {
            default:
                console.error(`Error (GetTopPhotos): ${Error}`);
                return next(new APIStatus(500));
        }
    }
}