import express from 'express';
import { CreateCheckout, WebhookHandler, GetSubscription, VerifySession, CancelSubscription } from '../Controllers/BillingController.js';
import { isAuth } from '../Middlewares/isauth.js';

const BillingRouter = express.Router();

BillingRouter.post('/checkout', isAuth, CreateCheckout);
BillingRouter.post('/cancel', isAuth, CancelSubscription);
BillingRouter.get('/subscription', isAuth, GetSubscription);
BillingRouter.get('/verify-session', VerifySession);
BillingRouter.post('/webhook', WebhookHandler);

export default BillingRouter;
