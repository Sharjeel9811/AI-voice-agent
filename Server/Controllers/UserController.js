import { GenerateToken } from "../Configs/Token.js";
import UserModel from "../Models/UserModels.js";

export const GoogleAuth = async (req, res) => {
  try {
    console.log("GoogleAuth body:", JSON.stringify(req.body));
    const { name, email } = req.body;

    if (!name || !email) {
      console.log("GoogleAuth missing fields:", { name, email });
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await UserModel.findOne({ email });
    console.log("GoogleAuth found user:", user ? user._id : "none");

    if (!user) {
      user = await UserModel.create({ name, email });
    }

    const token = GenerateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Success", user });

  } catch (error) {
    console.error("GoogleAuth error:", error.message, error.stack);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetCurrentUser = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Success", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateProfile = async (req, res) => {
  try {
    const allowed = ['assistantName', 'businessName', 'businnesstype', 'businessdescription', 'tone', 'theme', 'enablevoice'];
    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await UserModel.findByIdAndUpdate(req.userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "Success", user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const GetApiKey = async (req, res) => {
  try {
    let user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (!user.apiKey) {
      user.apiKey = 'va_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await user.save();
    }
    return res.status(200).json({ apiKey: user.apiKey, plan: user.plan });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const RegenerateApiKey = async (req, res) => {
  try {
    const newKey = 'va_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const user = await UserModel.findByIdAndUpdate(req.userId, { apiKey: newKey }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ apiKey: user.apiKey });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const LIMITS = { free: 100, premium: 2000, enterprise: Infinity };

export const GetUsage = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Reset monthly usage if month changed
    const now = new Date();
    const lastReset = user.lastMonthReset || new Date(0);
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      user.minutesUsed = 0;
      user.lastMonthReset = now;
      await user.save();
    }

    const minutesUsed = user.minutesUsed || 0;
    const limit = LIMITS[user.plan] || 100;
    const percentage = limit === Infinity ? 0 : Math.min(100, (minutesUsed / limit) * 100);

    return res.status(200).json({ minutesUsed, limit, percentage, plan: user.plan });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("GoogleAuth error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
