import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true,
    unique: true,
  },
  agentName: {
    type: String,
    default: 'My Assistant',
  },
  businessName: {
    type: String,
    default: '',
  },
  businessType: {
    type: String,
    default: '',
  },
  businessDescription: {
    type: String,
    default: '',
  },
  tone: {
    type: String,
    enum: ['professional', 'friendly', 'casual', 'sales', 'support'],
    default: 'friendly',
  },
  welcomeMessage: {
    type: String,
    default: 'Hi! How can I help you today?',
  },
  systemPrompt: {
    type: String,
    default: '',
  },
  theme: {
    type: String,
    enum: ['dark', 'light', 'glass', 'neon'],
    default: 'dark',
  },
  accentColor: {
    type: String,
    default: '#7C5CFC',
  },
  avatarUrl: {
    type: String,
    default: '',
  },
  enableVoice: {
    type: Boolean,
    default: true,
  },
  voiceSpeed: {
    type: Number,
    default: 1,
    min: 0.5,
    max: 2,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const AgentModel = mongoose.model('agents', AgentSchema);

export default AgentModel;
