import Express from 'express';
import { check, oneOf } from 'express-validator';

import * as InstagramBaseController from '../Controllers/InstagramBaseController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.post('/api/instagram/addaccount', oneOf([
    [check('login').isString(), check('password').isString()],
    [check('code').isString().isLength({ min: 4, max: 5 })]
]), InputMiddleware, InstagramBaseController.AddAccount);

export default Router;