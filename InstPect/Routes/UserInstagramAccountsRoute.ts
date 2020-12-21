import Express from 'express';
import { check, oneOf } from 'express-validator';

import AddAccount from '../Controllers/InstagramAccount/AddInstagramAccountController';
import RemoveAccount from '../Controllers/InstagramAccount/RemoveInstagramAccountController';
import ChangeStatus from '../Controllers/InstagramAccount/StatusInstagramAccountController';
import GetAccounts from '../Controllers/InstagramAccount/GetInstagramAccountsController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import OwnsInstagramAccountMiddleware from '../Middleware/OwnsInstagramAccountMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';

var Router = Express.Router();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.post('/api/instagram/addaccount', oneOf([
    [check('login').isString(), check('password').isString()],
    [check('code').isString().isLength({ min: 4, max: 5 })]
]), InputMiddleware, AddAccount);

Router.post('/api/instagram/removeaccount', [
    check('accountid').isInt()
], InputMiddleware, OwnsInstagramAccountMiddleware, RemoveAccount);

//Enable / disable instagram account
Router.post('/api/instagram/accountstatus', [
    check('accountid').isInt(),
    check('status').isBoolean()
], InputMiddleware, OwnsInstagramAccountMiddleware, ChangeStatus);

//Get all accounts with stats
Router.post('/api/instagram/accounts', GetAccounts);

export default Router;