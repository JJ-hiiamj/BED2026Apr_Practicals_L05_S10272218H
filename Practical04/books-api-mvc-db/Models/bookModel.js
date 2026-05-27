const sql = require("mssql");
const dotenv = require("dotenv");
const dbConfig = require("../dbConfig");

// Load environment variables (if any are used for DB config)
dotenv.config();

// Get all books
async function getAllBooks() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection
      .request()
      .query("SELECT id, title, author FROM Books");

    return result.recordset;
  } catch (error) {
    console.error("Database error (getAllBooks):", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

// Get a single book by ID
async function getBookById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", id);

    const result = await request.query(
      "SELECT id, title, author FROM Books WHERE id = @id"
    );

    return result.recordset[0] || null;
  } catch (error) {
    console.error("Database error (getBookById):", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

// Create a new book
async function createBook(bookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("title", bookData.title);
    request.input("author", bookData.author);

    await request.query(
      "INSERT INTO Books (title, author) VALUES (@title, @author)"
    );

    // Return the last inserted book (simplest approach for this practical)
    const result = await connection
      .request()
      .query(
        "SELECT TOP 1 id, title, author FROM Books ORDER BY id DESC"
      );

    return result.recordset[0];
  } catch (error) {
    console.error("Database error (createBook):", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

// Update a book
async function updateBook(id, updatedBookData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query =
      "UPDATE Books SET title = @title, author = @author WHERE id = @id";
    const request = connection.request();
    request.input("id", id);
    request.input("title", updatedBookData.title);
    request.input("author", updatedBookData.author);

    await request.query(query);

    return await getBookById(id); // Return the updated book
  } catch (error) {
    console.error("Database error (updateBook):", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

// Delete a book
async function deleteBook(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const query = "DELETE FROM Books WHERE id = @id";
    const request = connection.request();
    request.input("id", id);

    const result = await request.query(query);
    return result.rowsAffected[0] > 0; // Returns true if a row was deleted
  } catch (error) {
    console.error("Database error (deleteBook):", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
};