import mongoose from 'mongoose';

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
}, { timestamps: true });

const NewsletterModel = mongoose.model('newsletter', NewsletterSchema);

export default NewsletterModel;
