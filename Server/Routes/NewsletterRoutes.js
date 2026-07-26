import express from 'express';
import { Subscribe } from '../Controllers/NewsletterController.js';

const NewsletterRouter = express.Router();

NewsletterRouter.post('/subscribe', Subscribe);

export default NewsletterRouter;
