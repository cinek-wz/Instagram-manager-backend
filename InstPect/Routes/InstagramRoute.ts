import Express from 'express';
import { check, oneOf } from 'express-validator';

import * as InstagramController from '../Controllers/InstagramController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.post('/api/instagram/similartags', [
    check('tag').isString().isLength({min: 1, max: 40})
    ], InputMiddleware, InstagramController.FindSimilarTags);


export default Router;