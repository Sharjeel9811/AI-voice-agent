import AgentModel from '../Models/AgentModel.js';

export const SaveAgent = async (req, res) => {
  try {
    const {
      agentName, businessName, businessType, businessDescription,
      tone, welcomeMessage, systemPrompt, theme, accentColor,
      avatarUrl, enableVoice, voiceSpeed,
    } = req.body;

    const agent = await AgentModel.findOneAndUpdate(
      { userId: req.userId },
      {
        agentName, businessName, businessType, businessDescription,
        tone, welcomeMessage, systemPrompt, theme, accentColor,
        avatarUrl, enableVoice, voiceSpeed,
      },
      { new: true, upsert: true }
    );

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
