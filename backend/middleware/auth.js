const User = require("../models/User");

// Dummy authentication: always allow, attach first user as req.user
const auth = async (req, res, next) => {
  try {
    const user = await User.findOne({ isActive: true });
    if (!user) {
      return res.status(401).json({ message: "No active user found." });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Authentication failed." });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "Access denied. Admin privileges required." });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: "Authentication failed." });
  }
};

module.exports = { auth, adminAuth };
