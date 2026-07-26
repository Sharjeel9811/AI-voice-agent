import { GenerateToken } from "../Configs/Token.js";
import UserModel from "../Models/UserModels.js";

export const GoogleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({ name, email });
    }

    const token = GenerateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({ message: "Success", user });

  } catch (error) {
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

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("GoogleAuth error:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};
