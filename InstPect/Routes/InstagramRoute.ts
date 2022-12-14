import Express from 'express';
import multer from 'multer';
import { check, oneOf, query, body } from 'express-validator';

import AddAccount from '../Controllers/InstagramAccount/AddInstagramAccountController';
import RemoveAccount from '../Controllers/InstagramAccount/RemoveInstagramAccountController';
import ChangeStatus from '../Controllers/InstagramAccount/StatusInstagramAccountController';
import GetAccounts from '../Controllers/InstagramAccount/GetInstagramAccountsController';


import PhotoSchedule from '../Controllers/InstagramActions/PhotoScheduleController';
import GetSchedule from "../Controllers/InstagramActions/GetScheduleController";
import DeleteSchedule from "../Controllers/InstagramActions/DeleteScheduleController";
import GetInsights from '../Controllers/InstagramActions/GetInsightsController';
import FindSimilarTags from '../Controllers/InstagramActions/FindSimilarTagsController';
import GetTopPhotos from "../Controllers/InstagramActions/GetTopPhotosController";

import LoggedInMiddleware from '../Middleware/Main/AuthMiddleware';
import OwnsInstagramAccountMiddleware from '../Middleware/OwnsInstagramAccountMiddleware';
import InputMiddleware from '../Middleware/Main/InputMiddleware';
import { CacheMiddleware } from '../Middleware/Main/CacheMiddleware';


var Router = Express.Router();
let MulterMiddleware = multer();

Router.use(LoggedInMiddleware);

/**
 * User instagram account
*/

Router.post('/api/instagram/account', oneOf([
    [check('login').isString(), check('password').isString()],
    [check('code').isString().isLength({ min: 4, max: 5 })]
]), InputMiddleware, AddAccount);

Router.delete('/api/instagram/account', [
    check('accountid').isInt()
], InputMiddleware, OwnsInstagramAccountMiddleware, RemoveAccount);

//Enable / disable instagram account
Router.put('/api/instagram/account', [
    check('accountid').isInt(),
    check('status').isBoolean()
], InputMiddleware, OwnsInstagramAccountMiddleware, ChangeStatus);

//Get all accounts with stats
Router.get('/api/instagram/accounts', GetAccounts);

/**
 * User instagram account actions
*/

Router.get('/api/instagram/similartags', [
    query('accountid').isInt(),
    query('tag').isString().isLength({ min: 1, max: 40 }).customSanitizer(value => {
        return value.match(/^[^.($| )]+/gm)[0].replace("#", "");
    })
], InputMiddleware, CacheMiddleware(129600, `similartags`, [{ type: "query", name: "tag" }]), OwnsInstagramAccountMiddleware, FindSimilarTags);

Router.get('/api/instagram/insights', [
    query('accountid').isInt()
], InputMiddleware, CacheMiddleware(43200, `insights`, [{ type: "query", name: "accountid" }]), OwnsInstagramAccountMiddleware, GetInsights);

Router.delete('/api/instagram/photoscheduler', [
    body('accountid').isInt(),
    body('scheduleid').isInt()
], InputMiddleware, OwnsInstagramAccountMiddleware, DeleteSchedule);

Router.get('/api/instagram/photoscheduler', [
    query('accountid').isInt()
], InputMiddleware, OwnsInstagramAccountMiddleware, GetSchedule);

Router.post('/api/instagram/photoscheduler', MulterMiddleware.single('uploaded_photo'), [
    body('accountid').isInt(),
    body('description').isString(),
    body('date').isISO8601().custom((value) => {
        return ((Date.now() > new Date(value).getTime()) ? false : new Date(value).getTime());
    })
], InputMiddleware, OwnsInstagramAccountMiddleware, PhotoSchedule);

Router.get('/api/instagram/topphotos', [
    query('accountid').isInt()
], InputMiddleware, CacheMiddleware(43200, `topphotos`, [{ type: "query", name: "accountid" }]), OwnsInstagramAccountMiddleware, GetTopPhotos);

export default Router;