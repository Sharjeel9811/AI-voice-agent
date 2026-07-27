import AgentModel from '../Models/AgentModel.js';
import UserModel from '../Models/UserModels.js';

const PLAN_LIMITS = {
  free: { agents: 1, themes: ['dark', 'light'] },
  premium: { agents: 5, themes: ['dark', 'light', 'glass', 'neon'] },
  enterprise: { agents: Infinity, themes: ['dark', 'light', 'glass', 'neon'] },
};

export const SaveAgent = async (req, res) => {
  try {
    const {
      agentId, agentName, businessName, businessType, businessDescription,
      tone, welcomeMessage, systemPrompt, theme, accentColor,
      avatarUrl, enableVoice, voiceSpeed,
    } = req.body;

    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const limits = PLAN_LIMITS[user.plan] || PLAN_LIMITS.free;

    // Validate theme
    if (theme && !limits.themes.includes(theme)) {
      return res.status(403).json({
        message: `Theme "${theme}" is not available on your ${user.plan} plan. Upgrade to access all themes.`,
      });
    }

    const updateFields = {
      agentName, businessName, businessType, businessDescription,
      tone, welcomeMessage, systemPrompt, theme, accentColor,
      avatarUrl, enableVoice, voiceSpeed,
    };

    let agent;

    if (agentId) {
      // Update existing agent
      agent = await AgentModel.findOneAndUpdate(
        { _id: agentId, userId: req.userId },
        updateFields,
        { new: true }
      );
      if (!agent) return res.status(404).json({ message: 'Agent not found' });
    } else {
      // Check agent count before creating new
      const count = await AgentModel.countDocuments({ userId: req.userId });
      if (count >= limits.agents) {
        return res.status(403).json({
          message: `Agent limit reached. Your ${user.plan} plan allows ${limits.agents === Infinity ? 'unlimited' : limits.agents} agent(s).`,
        });
      }
      agent = await AgentModel.create({ userId: req.userId, ...updateFields });
    }

    return res.status(200).json({ message: 'Agent saved', agent });
  } catch (error) {
    console.error('Save agent error:', error);
    return res.status(500).json({ message: 'Failed to save agent' });
  }
};

export const GetAgent = async (req, res) => {
  try {
    const agent = await AgentModel.findOne({ userId: req.userId });
    return res.status(200).json({ agent });
  } catch (error) {
    console.error('Get agent error:', error);
    return res.status(500).json({ message: 'Failed to get agent' });
  }
};

export const GetAgents = async (req, res) => {
  try {
    const agents = await AgentModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    return res.status(200).json({ agents });
  } catch (error) {
    console.error('Get agents error:', error);
    return res.status(500).json({ message: 'Failed to get agents' });
  }
};

export const DeleteAgent = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await AgentModel.findOneAndDelete({ _id: id, userId: req.userId });
    if (!agent) return res.status(404).json({ message: 'Agent not found' });
    return res.status(200).json({ message: 'Agent deleted' });
  } catch (error) {
    console.error('Delete agent error:', error);
    return res.status(500).json({ message: 'Failed to delete agent' });
  }
};

export const GetAgentPublic = async (req, res) => {
  try {
    const { userId } = req.params;
    const agent = await AgentModel.findOne({ userId, isActive: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }
    return res.status(200).json({
      agent: {
        agentName: agent.agentName,
        welcomeMessage: agent.welcomeMessage,
        theme: agent.theme,
        accentColor: agent.accentColor,
        avatarUrl: agent.avatarUrl,
        enableVoice: agent.enableVoice,
        voiceSpeed: agent.voiceSpeed,
        tone: agent.tone,
        businessName: agent.businessName,
        businessType: agent.businessType,
        businessDescription: agent.businessDescription,
        systemPrompt: agent.systemPrompt,
      },
    });
  } catch (error) {
    console.error('Get public agent error:', error);
    return res.status(500).json({ message: 'Failed to get agent' });
  }
};
