const express = require("express");
const User = require("../models/User");
const ActivityLog = require("../models/ActivityLog");
const { auth, adminAuth } = require("../middleware/auth");

const router = express.Router();

// Get all users (Admin only)
router.get("/", adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { username: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (Admin only)
router.get("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (Admin only)
router.put("/:id", adminAuth, async (req, res) => {
  try {
    const { username, email, role, isActive } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for duplicate username/email
    if (username !== user.username || email !== user.email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.params.id },
        $or: [{ username }, { email }],
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already exists",
        });
      }
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.isActive = isActive !== undefined ? isActive : user.isActive;

    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "update_user",
      description: `User updated: ${user.username}`,
      resourceType: "user",
      resourceId: user._id,
      ipAddress: req.ip,
    });

    res.json({
      message: "User updated successfully",
      user: user.toJSON(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete("/:id", adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    await User.findByIdAndDelete(req.params.id);

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "delete_user",
      description: `User deleted: ${user.username}`,
      resourceType: "user",
      resourceId: user._id,
      ipAddress: req.ip,
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Reset user password (Admin only)
router.post("/:id/reset-password", adminAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.password = newPassword;
    await user.save();

    // Log activity
    await ActivityLog.create({
      userId: req.user._id,
      action: "update_user",
      description: `Password reset for user: ${user.username}`,
      resourceType: "user",
      resourceId: user._id,
      ipAddress: req.ip,
    });

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
