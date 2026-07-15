const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { getUserByUsername, createUser } = require("../models/userModel");

const router = express.Router();

// ---------------------------------------------
// POST /register
// ---------------------------------------------
router.post("/register", async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // --- Basic validation ---
    if (!username || !password || !role) {
      return res
        .status(400)
        .json({ message: "username, password, and role are required" });
    }

    if (!["member", "librarian"].includes(role)) {
      return res
        .status(400)
        .json({ message: "role must be 'member' or 'librarian'" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    // --- Check for existing username ---
    const existingUser = await getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // --- Hash password ---
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // --- Create user ---
    const newUser = await createUser(username, passwordHash, role);

    return res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// ---------------------------------------------
// POST /login
// ---------------------------------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }

    const user = await getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: user.user_id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "3600s",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
