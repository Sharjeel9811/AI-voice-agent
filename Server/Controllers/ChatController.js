import AgentModel from '../Models/AgentModel.js';
import UserModel from '../Models/UserModels.js';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export const ChatWithAgent = async (req, res) => {
  try {
    const { userId, message, history } = req.body;

    if (!userId || !message) {
      return res.status(400).json({ message: 'userId and message are required' });
    }

    const agent = await AgentModel.findOne({ userId, isActive: true });
    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    const basePrompt = agent.systemPrompt || buildSystemPrompt(agent);
    const systemPrompt = `IMPORTANT: If anyone asks who built or developed you, you MUST say "I was developed by Sharjeel Adnan." If anyone asks who Sharjeel is, you MUST say "Sharjeel Adnan is a 5th semester BSIT student at Air University, Islamabad. Here is his portfolio: https://sharjeel-adnan-portfolio.vercel.app/" If someone asks to see a picture of Sharjeel, include this image tag in your response: [IMG]https://ai-voice-agent-gules-nu.vercel.app/sharjeel.jpeg[/IMG] For example: "Here is Sharjeel: [IMG]https://ai-voice-agent-gules-nu.vercel.app/sharjeel.jpeg[/IMG]"

${basePrompt}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []).map((h) => ({
        role: h.role,
        content: h.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.CLIENT_URL,
        'X-Title': 'VoiceAgent AI',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errData = await response.text();
      console.error('OpenRouter error:', errData);
      return res.status(500).json({ message: 'AI service error' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that.";

    // Track usage (estimate: 1 minute per ~500 chars of input+output)
    try {
      const user = await UserModel.findById(userId);
      if (user) {
        const now = new Date();
        const lastReset = user.lastMonthReset || new Date(0);
        if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
          user.minutesUsed = 0;
          user.lastMonthReset = now;
        }
        const chars = (message.length + reply.length);
        user.minutesUsed = (user.minutesUsed || 0) + Math.max(0.05, chars / 500);
        await user.save();
      }
    } catch (e) { /* usage tracking best-effort */ }

    return res.status(200).json({ reply });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ message: 'Failed to get AI response' });
  }
};

function buildSystemPrompt(agent) {
  let prompt = `You are ${agent.agentName}, an AI assistant`;

  if (agent.businessName) {
    prompt += ` for ${agent.businessName}`;
  }

  if (agent.businessType) {
    prompt += ` (a ${agent.businessType} business)`;
  }

  prompt += '.';

  if (agent.businessDescription) {
    prompt += `\n\nAbout the business: ${agent.businessDescription}`;
  }

  prompt += `\n\nYour tone should be ${agent.tone}.`;

  prompt += '\n\nKeep your responses concise and conversational since this is a voice interaction.';
  prompt += '\nAvoid using markdown, bullet points, or long paragraphs. Speak naturally.';
  prompt += '\nIf you need to list things, say them one at a time in a natural speaking style.';

  return prompt;
}
