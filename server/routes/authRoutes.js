const express = require("express");
const User = require("../models/User.js");
const Member = require("../models/Members.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware.js");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Generate JWT Token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

// @route   POST /api/auth/signup
router.post("/signup", async (req, res) => {
  const { name, email, password, description, country, speaks, learns, image } =
    req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      const token = generateToken(res, user._id);

      // Create member profile
      const newMember = new Member({
        user: user._id, // Associate member with the created user
        name: user.name, // Get name from User model
        description,
        country,
        speaks: speaks.split(",").map((speak) => speak.trim()), // Split and trim speaks
        learns: learns.split(",").map((learn) => learn.trim()), // Split and trim learns
        image,
        status: "offline", // Default status
      });

      await newMember.save();

      res
        .status(201)
        .json({ message: "User registered successfully", user, token });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// @route   POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(res, user._id);
      res.json({ user, token });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// @route   GET /api/auth/verify/me
router.get("/verify/me", protect, async (req, res) => {
  res.json(req.user);
});

// @route   POST /api/auth/logout
router.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out successfully" });
});

module.exports = router;
