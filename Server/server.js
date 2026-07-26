import express from 'express';
import dotenv from 'dotenv';
import { ConnectDB } from './Configs/db.js';
import UserRouter from './Routes/UserRoutes.js';
import NewsletterRouter from './Routes/NewsletterRoutes.js';
import BillingRouter from './Routes/BillingRoutes.js';
import AgentRouter from './Routes/AgentRoutes.js';
import WIDGET_SCRIPT from './Configs/widgetScript.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


dotenv.config();



const app=express();

// Webhook needs raw body - register before json parser
app.use('/api/billing/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:['http://localhost:5173','http://localhost:5174'],
    credentials:true
}))

// Widget needs to be embeddable
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'ALLOWALL');
  res.setHeader('Content-Security-Policy', "frame-ancestors *");
  next();
});

ConnectDB();

const port=process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send("Hello from server");
})

app.use('/api/user',UserRouter);
app.use('/api/newsletter',NewsletterRouter);
app.use('/api/billing',BillingRouter);
app.use('/api/agent',AgentRouter);

// Serve widget script (no-cache so updates apply immediately)
app.get('/widget.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.send(WIDGET_SCRIPT);
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
