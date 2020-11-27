import Express from 'express';
import { check } from 'express-validator/check';

import * as UserController from '../Controllers/UserController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.get('/api/user/profile', UserController.GetProfile);

export { Router as UserRoute };