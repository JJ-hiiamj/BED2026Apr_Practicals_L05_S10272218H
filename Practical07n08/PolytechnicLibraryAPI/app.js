const express = require("express");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
app.use(express.json());

// Routes
app.use("/", authRoutes); // /register, /login
app.use("/", bookRoutes); // /books, /books/:bookId/availability

// Basic health check
app.get("/", (req, res) => {
  res.json({ message: "Polytechnic Library API is running" });
});

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
