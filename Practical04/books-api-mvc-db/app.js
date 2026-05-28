// Week 5 Practical, added
const path = require("path");

const express = require("express");
const sql = require("mssql");
const dotenv = require("dotenv");
const dbConfig = require("./dbConfig");
// Load environment variables
dotenv.config();

const bookController = require("./controllers/bookController");
const userController = require("./controllers/userController");
const {
  validateBook,
  validateBookId,
} = require("./middlewares/bookValidation"); // import Book Validation Middleware

// Create Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(express.static(path.join(__dirname, "Public"))); // Serve static files first
// --- Add other general middleware here (e.g., logging, security headers) ---

// Routes for books
// Link specific URL paths to the corresponding controller functions
app.get("/books", bookController.getAllBooks);
app.get("/books/:id", bookController.getBookById);
app.post("/books", bookController.createBook);
// Add routes for PUT/DELETE if implemented, applying appropriate middleware
app.put("/books/:id", validateBookId, validateBook, bookController.updateBook);
app.delete("/books/:id", validateBookId, bookController.deleteBook);

// Routes for users
app.post("/users", userController.createUser);
app.get("/users", userController.getAllUsers);
app.get("/users/search", userController.searchUsers);
app.get("/users/with-books", userController.getUsersWithBooks);
app.get("/users/:id", userController.getUserById);
app.put("/users/:id", userController.updateUser);

// Add routes for searching users and fetching users with books
app.delete("/users/:id", userController.deleteUser);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
// Listen for termination signals (like Ctrl+C)
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Close any open connections
  await sql.close();
  console.log("DB Config:", dbConfig);
  console.log("Database connections closed");
  process.exit(0); // Exit the process
});