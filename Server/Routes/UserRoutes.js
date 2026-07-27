import express from 'express';
import { GetCurrentUser, GoogleAuth,UpdateProfile,Logout,GetUsage,GetApiKey,RegenerateApiKey } from '../Controllers/UserController.js';
import { isAuth } from '../Middlewares/isauth.js';


const UserRouter=express.Router();



UserRouter.post('/register',GoogleAuth);
UserRouter.get('/current',isAuth,GetCurrentUser);
UserRouter.patch('/update',isAuth,UpdateProfile);
UserRouter.get('/usage',isAuth,GetUsage);
UserRouter.get('/api-key',isAuth,GetApiKey);
UserRouter.post('/api-key/regenerate',isAuth,RegenerateApiKey);
UserRouter.get('/logout',Logout);

export default UserRouter;