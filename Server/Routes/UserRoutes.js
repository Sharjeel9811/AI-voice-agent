import express from 'express';
import { GetCurrentUser, GoogleAuth,UpdateProfile,Logout } from '../Controllers/UserController.js';
import { isAuth } from '../Middlewares/isauth.js';


const UserRouter=express.Router();



UserRouter.post('/register',GoogleAuth);
UserRouter.get('/current',isAuth,GetCurrentUser);
UserRouter.patch('/update',isAuth,UpdateProfile);
UserRouter.get('/logout',Logout);

export default UserRouter;