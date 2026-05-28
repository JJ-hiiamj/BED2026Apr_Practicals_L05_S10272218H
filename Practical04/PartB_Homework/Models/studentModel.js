const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request().query("SELECT student_id, name, address FROM Students");
    return result.recordset;
  } finally {
    if (connection) await connection.close();
  }
}

// Get student by ID
async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .query("SELECT student_id, name, address FROM Students WHERE student_id = @id");
    return result.recordset[0] || null;
  } finally {
    if (connection) await connection.close();
  }
}

// Create student
async function createStudent(data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("name", sql.VarChar(100), data.name)
      .input("address", sql.VarChar(255), data.address)
      .query("INSERT INTO Students (name, address) OUTPUT INSERTED.student_id VALUES (@name, @address)");
    const newId = result.recordset[0].student_id;
    return await getStudentById(newId);
  } finally {
    if (connection) await connection.close();
  }
}

// Update student
async function updateStudent(id, data) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .input("name", sql.VarChar(100), data.name)
      .input("address", sql.VarChar(255), data.address)
      .query("UPDATE Students SET name=@name, address=@address WHERE student_id=@id");
    if (result.rowsAffected[0] === 0) return null;
    return await getStudentById(id);
  } finally {
    if (connection) await connection.close();
  }
}

// Delete student
async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM Students WHERE student_id=@id");
    return result.rowsAffected[0] > 0;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent };
