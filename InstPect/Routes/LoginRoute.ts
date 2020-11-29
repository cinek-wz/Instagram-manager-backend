import Express from 'express';
import { check, oneOf } from 'express-validator';

import * as LoginController from '../Controllers/LoginController';

import InputMiddleware from '../Middleware/InputMiddleware';
import CaptchaMiddleware from '../Middleware/CaptchaMiddleware';

var Router = Express.Router();
//, check('captcha').isString()

Router.post('/api/register', [ 
    check('login').isString().isLength({ min: 2, max: 50 }),
    check('password').isString().isLength({ min: 3, max: 50 }),
    check('email').isString().isEmail().isLength({ min: 3, max: 50 }) 
    ], InputMiddleware, CaptchaMiddleware, LoginController.Register);

Router.post('/api/login', [ 
    check('login').isString().isLength({ min: 2, max: 50 }), 
    check('password').isString().isLength({ min: 3, max: 50 }) 
], InputMiddleware, CaptchaMiddleware, LoginController.Login);

Router.post('/api/user/recoverypassword', oneOf([
    [check('email').isString().isEmail().isLength({ min: 3, max: 50 }), check('secret').not().exists()],
    [check('secret').isString().isLength({ min: 128, max: 128 }), check('newpassword').isString().isLength({ min: 3, max: 50 }), check('email').not().exists()]
]),
    InputMiddleware, LoginController.RecoverPassword);

Router.get('/api/logout', LoginController.Logout);

export { Router as LoginRoute };