const express = require("express");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, fullName } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Create new user
    const user = new User({
      username,
      email,
      password,
      role: role || "user",
      fullName,
    });

    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: "create_user",
      description: `User account created: ${username}`,
      resourceType: "user",
      resourceId: user._id,
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "User created successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true,
    });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: user._id,
      action: "login",
      description: `User logged in: ${user.username}`,
      resourceType: "system",
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });

    res.json({
      message: "Login successful",
      user: user.toJSON(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Logout
router.post("/logout", auth, async (req, res) => {
  try {
    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "logout",
      description: `User logged out: ${req.user.username}`,
      resourceType: "system",
      ipAddress: req.ip,
    });

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
