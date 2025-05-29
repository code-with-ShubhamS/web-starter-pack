import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import sendEmail from "../utils/email.js";
import isAuthenticated from "../middleware/auth.js";

const router = express.Router();
// Helper function to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET || "your-jwt-secret",
    { expiresIn: "7d" }
  );
};

// Helper function to set JWT cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login`,
    session: false,
  }),
  (req, res) => {
    // Generate JWT token
    const token = generateToken(req.user.user); // we on token we have user object

    // Set token cookie
    setTokenCookie(res, token);

    // Redirect to frontend
    res.redirect(
      `${process.env.FRONTEND_URL || "http://localhost:5173"}/google/callback`
    );
  }
);

// Send OTP route
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Generate OTP
    const otp = generateOTP();

    // Set expiry time (5 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Save OTP to database
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendEmail(
      email,
      "Your OTP for Authentication",
      `Your OTP is: ${otp}. It will expire in 5 minutes.`
    );

    res.status(200).json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP route
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res
        .status(400)
        .json({ success: false, message: "Email and OTP are required" });
    }

    // Find OTP in database
    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: "OTP not found" });
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
      await Otp.deleteOne({ email });
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    // Check if OTP matches
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Delete OTP record
    await Otp.deleteOne({ email });

    // Check if user exists
    let user = await User.findOne({ email });
    //     if (user && user.authType !== 'email') {
    //   return res.status(400).json({ success: false, message: "This account was created using Google OAuth. Please login with Google." });
    // }
    if (!user) {
      // Create new user
      user = await User.create({
        name: email.split("@")[0], // Simple name from email
        email,
        authType: "email",
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Set token cookie
    setTokenCookie(res, token);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).json({ success: false, message: "Failed to verify OTP" });
  }
});

// Resend OTP route
router.post("/resend-otp", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Generate new OTP
    const otp = generateOTP();

    // Set expiry time (5 minutes)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    // Save OTP to database
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send OTP email
    await sendEmail(
      email,
      "Your New OTP for Authentication",
      `Your OTP is: ${otp}. It will expire in 5 minutes.`
    );

    res.status(200).json({ success: true, message: "OTP resent successfully" });
  } catch (error) {
    console.error("Error resending OTP:", error);
    res.status(500).json({ success: false, message: "Failed to resend OTP" });
  }
});

// Get user profile route
router.get("/profile", isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      profileImage: req.user.profileImage,
    },
  });
});

// Logout route
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ success: true, message: "Logged out successfully" });
});

export default router;
