import express from 'express';
import { SaveAgent, GetAgent, GetAgents, DeleteAgent, GetAgentPublic } from '../Controllers/AgentController.js';
import { ChatWithAgent } from '../Controllers/ChatController.js';
import { isAuth } from '../Middlewares/isauth.js';

const AgentRouter = express.Router();

AgentRouter.post('/save', isAuth, SaveAgent);
AgentRouter.get('/config', isAuth, GetAgent);
AgentRouter.get('/list', isAuth, GetAgents);
AgentRouter.delete('/:id', isAuth, DeleteAgent);
AgentRouter.get('/public/:userId', GetAgentPublic);
AgentRouter.post('/chat', ChatWithAgent);

export default AgentRouter;
