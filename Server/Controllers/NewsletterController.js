import NewsletterModel from '../Models/NewsletterModel.js';

export const Subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const existing = await NewsletterModel.findOne({ email });
    if (existing) {
      return res.status(200).json({ message: "You're already subscribed!" });
    }

    await NewsletterModel.create({ email });
    return res.status(200).json({ message: "Subscribed successfully!" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
