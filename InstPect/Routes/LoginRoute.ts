import Express from 'express';
import { check } from 'express-validator/check';

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

Router.get('/api/logout', LoginController.Logout);

export { Router as LoginRoute };