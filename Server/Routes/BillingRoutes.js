import express from 'express';
import { CreateCheckout, WebhookHandler, GetSubscription, VerifySession } from '../Controllers/BillingController.js';
import { isAuth } from '../Middlewares/isauth.js';

const BillingRouter = express.Router();

BillingRouter.post('/checkout', isAuth, CreateCheckout);
BillingRouter.get('/subscription', isAuth, GetSubscription);
BillingRouter.get('/verify-session', VerifySession);
BillingRouter.post('/webhook', WebhookHandler);

export default BillingRouter;
