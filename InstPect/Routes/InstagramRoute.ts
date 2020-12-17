import Express from 'express';
import multer from 'multer';
import { check, oneOf } from 'express-validator';

import PhotoScheduleController from '../Controllers/PhotoScheduleController';
import GetInsightsController from '../Controllers/GetInsightsController';
import FindSimilarTagsController from '../Controllers/FindSimilarTagsController';

import LoggedInMiddleware from '../Middleware/AuthMiddleware';
import OwnsInstagramAccountMiddleware from '../Middleware/OwnsInstagramAccountMiddleware';
import InputMiddleware from '../Middleware/InputMiddleware';


var Router = Express.Router();
let MulterMiddleware = multer();

//Only for logged in users
Router.use(LoggedInMiddleware);

Router.post('/api/instagram/similartags', [
    check('accountid').isInt(),
    check('tag').isString().isLength({min: 1, max: 40})
], InputMiddleware, OwnsInstagramAccountMiddleware, FindSimilarTagsController);

Router.post('/api/instagram/insights', [
    check('accountid').isInt()
], InputMiddleware, OwnsInstagramAccountMiddleware, GetInsightsController);

Router.post('/api/instagram/photoscheduler', MulterMiddleware.single('uploaded_photo'), [
    check('accountid').isInt(),
    check('description').isString(),
    check('date').isDate()
], InputMiddleware, OwnsInstagramAccountMiddleware, PhotoScheduleController);

export default Router;