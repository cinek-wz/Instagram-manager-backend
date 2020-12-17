import Express from 'express';
import { check, oneOf } from 'express-validator';

import AddInstagramAccountController from '../Controllers/AddInstagramAccountController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import OwnsInstagramAccountMiddleware from '../Middleware/OwnsInstagramAccountMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.post('/api/instagram/addaccount', oneOf([
    [check('login').isString(), check('password').isString()],
    [check('code').isString().isLength({ min: 4, max: 5 })]
]), InputMiddleware, AddInstagramAccountController);

Router.post('/api/instagram/removeaccount', [
    check('accountid').isInt()
    ], InputMiddleware, OwnsInstagramAccountMiddleware, );

//Enable / disable instagram account
Router.post('/api/instagram/accountstatus', [
    check('accountid').isInt(),
    check('status').isBoolean()
], InputMiddleware, OwnsInstagramAccountMiddleware, );

//Get all accounts with stats

export default Router;