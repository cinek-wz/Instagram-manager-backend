import { getRepository } from 'typeorm';
import { createHash } from 'crypto';
import { IgApiClient, IgCheckpointError, AccountFollowersFeed } from 'instagram-private-api';

import * as InstagramModel from '../Models/InstagramModel';

import { APIStatus } from '../Middleware/APIMiddleware';

export async function AddAccount(req, res, next)
{
    try
    {
        let UserID = req.session.userid;
        let Code = req.body.code;
        let Login = req.body.login;
        let Password = req.body.password;

        let IGClient = new IgApiClient();
        IGClient.state.generateDevice("instpect");

        // Check if account already exists in database
        await InstagramModel.InstagramAccountExists(Login);

        // Login to account
        if (Login != null && Password != null)
        {
            req.session.igaddstate = null;

            try
            {
                await IGClient.simulate.preLoginFlow();
                await IGClient.account.login(Login, Password);
                await IGClient.simulate.postLoginFlow();

                console.log(`Account ${Login} successfully added`);

                let Session = JSON.stringify(await IGClient.state.serialize());
                await InstagramModel.InstagramAccountAdd(UserID, Login, Password, Session);

                return next(new APIStatus(200));
            }
            catch (IgCheckpointError)
            {
                console.log(IgCheckpointError);
                console.log(`Account ${Login} requires verification`);
                await IGClient.challenge.auto(true);

                req.session.igaddstate = await IGClient.state.serialize();
                return next(new APIStatus(100));
            }
        }
        // Enter code from email
        else
        {
            try
            {
                await IGClient.state.deserialize(req.session.igaddstate);
                await IGClient.challenge.sendSecurityCode(Code);

                console.log(`Account ${Login} sent security code`);

                req.session.igaddstate = null;

                await InstagramModel.InstagramAccountAdd(UserID, Login, Password, await IGClient.state.serialize());
                return next(new APIStatus(200));
            }
            catch (IgCheckpointError)
            {
                console.log(`Account ${Login} could not resolve checkpoint`);
                return next(new APIStatus(400));
            }
        }
    }
    catch(Error)
    {
        switch (Error.code) {
            //Account already exists
            case 0:
                return next(new APIStatus(409));
            default:
                console.error(`Error (AddAccount): ${Error}`);
                return next(new APIStatus(500));
        }

    }
}

