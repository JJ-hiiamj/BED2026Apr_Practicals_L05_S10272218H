const { sql, poolPromise } = require("../dbConfig");

// Look up a user by username
async function getUserByUsername(username) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .query("SELECT * FROM Users WHERE username = @username");

  return result.recordset[0]; // undefined if not found
}

// Create a new user
async function createUser(username, passwordHash, role) {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input("username", sql.VarChar, username)
    .input("passwordHash", sql.VarChar, passwordHash)
    .input("role", sql.VarChar, role)
    .query(
      `INSERT INTO Users (username, passwordHash, role)
       OUTPUT INSERTED.user_id, INSERTED.username, INSERTED.role
       VALUES (@username, @passwordHash, @role)`
    );

  return result.recordset[0];
}

module.exports = {
  getUserByUsername,
  createUser,
  sql, 
  poolPromise
};
