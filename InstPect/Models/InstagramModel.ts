import { getRepository } from "typeorm";
import { IgApiClient, IgCheckpointError, AccountFollowersFeed } from 'instagram-private-api';

import InstagramAccount from '../Entities/InstagramAccount';
import User from '../Entities/User';
import ErrorEx from "../Utils/Error";

export async function GetSimilarTags(InstagramClient: IgApiClient, Tag: string): Promise<Array<{ tag: string, count: number }>>
{
    try
    {
        let tags = await InstagramClient.feed.tags(Tag, "top");
        await tags.request();
        let Items = await tags.items();

        let Collection: Array<{ tag: string, count: number }> = [];

        for (let Item of Items) {
            if (Item.caption == null) continue;

            let Text = Item.caption.text;
            let Match = Text.match(/(#.*?)(?= |#|\n|$)/gm);

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

        Collection = Collection.sort((a, b) => {
            if (a.count - b.count < 0)
                return 1;
            if (a.count - b.count > 0)
                return -1;
            return 0;
        });
        return Collection.slice(0, 30);
    }
    catch (Error)
    {
        throw new ErrorEx(2);
    }
}