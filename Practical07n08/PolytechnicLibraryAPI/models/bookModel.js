const { sql, poolPromise } = require("../dbConfig");

// Get all books
async function getAllBooks() {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query("SELECT book_id, title, author, availability FROM Books");

  return result.recordset;
}

// Get a single book by ID
async function getBookById(bookId) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("bookId", sql.Int, bookId)
    .query("SELECT * FROM Books WHERE book_id = @bookId");

  return result.recordset[0];
}

// Update a book's availability
async function updateBookAvailability(bookId, availability) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("bookId", sql.Int, bookId)
    .input("availability", sql.Char(1), availability)
    .query(
      `UPDATE Books
       SET availability = @availability
       OUTPUT INSERTED.book_id, INSERTED.title, INSERTED.author, INSERTED.availability
       WHERE book_id = @bookId`
    );

  return result.recordset[0]; // undefined if bookId didn't exist
}

module.exports = {
  getAllBooks,
  getBookById,
  updateBookAvailability,
  sql, 
  poolPromise
};
