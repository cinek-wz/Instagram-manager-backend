import Express from 'express';
import { check, oneOf } from 'express-validator';

import * as UserController from '../Controllers/UserActions/UserController';

import LoggedInMiddleware from '../Middleware/Main/AuthMiddleware';
import InputMiddleware from '../Middleware/Main/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.get('/api/user/profile', UserController.GetProfile);

Router.post('/api/user/changepassword', [
    check('currentpassword').isString().isLength({ min: 3, max: 50 }),
    check('newpassword').isString().isLength({ min: 3, max: 50 })
    ],
    InputMiddleware, UserController.ChangePassword);

Router.post('/api/user/profile', [
    check('email').isString().isEmail().isLength({ min: 3, max: 50 })
    ],
    InputMiddleware, UserController.ModifyProfile);

export default Router;