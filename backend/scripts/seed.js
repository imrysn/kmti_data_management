const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("../models/User");

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI ||
        "mongodb://localhost:27017/kmti_data_management"
    );
    console.log("Connected to MongoDB");

    // Clear existing users
    await User.deleteMany({});
    console.log("Cleared existing users");

    // Create admin user
    const adminUser = new User({
      username: "admin",
      email: "admin@kmti.com",
      password: "admin123",
      role: "admin",
    });
    await adminUser.save();
    console.log("Created admin user: admin / admin123");

    // Create regular user
    const regularUser = new User({
      username: "user",
      email: "user@kmti.com",
      password: "user123",
      role: "user",
    });
    await regularUser.save();
    console.log("Created regular user: user / user123");

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
}

seedDatabase();
