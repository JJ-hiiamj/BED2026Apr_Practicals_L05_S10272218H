const express = require("express");
const { verifyJWT, authorizeRoles } = require("../middleware/auth");
const {
  getAllBooks,
  getBookById,
  updateBookAvailability,
} = require("../models/bookModel");

const router = express.Router();

// ---------------------------------------------
// GET /books  -> members AND librarians
// ---------------------------------------------
router.get(
  "/books",
  verifyJWT,
  authorizeRoles("member", "librarian"),
  async (req, res) => {
    try {
      const books = await getAllBooks();
      return res.status(200).json({ books });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// ---------------------------------------------
// GET /books/:bookId  -> members AND librarians
// ---------------------------------------------
router.get(
  "/books/:bookId",
  verifyJWT,
  authorizeRoles("member", "librarian"),
  async (req, res) => {
    const { bookId } = req.params;

    try {
      const book = await getBookById(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({ book });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

// ---------------------------------------------
// PUT /books/:bookId/availability  -> librarians only
// ---------------------------------------------
router.put(
  "/books/:bookId/availability",
  verifyJWT,
  authorizeRoles("librarian"),
  async (req, res) => {
    const { bookId } = req.params;
    const { availability } = req.body;

    try {
      if (!["Y", "N"].includes(availability)) {
        return res
          .status(400)
          .json({ message: "availability must be 'Y' or 'N'" });
      }

      const existingBook = await getBookById(bookId);
      if (!existingBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      const updatedBook = await updateBookAvailability(bookId, availability);

      return res.status(200).json({
        message: "Book availability updated successfully",
        book: updatedBook,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = router;
