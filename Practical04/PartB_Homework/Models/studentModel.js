const sql = require("mssql");
const dbConfig = require("../dbConfig");

async function getAllStudents() {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection
      .request()
      .query(
        "SELECT student_id AS id, name, address FROM Students"
      );
    return result.recordset;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function getStudentById(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(
      "SELECT student_id AS id, name, address FROM Students WHERE student_id = @id"
    );
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function createStudent(studentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("name", studentData.name);
    request.input("address", studentData.address ?? "");
    const result = await request.query(
      `INSERT INTO Students (name, address)
       OUTPUT INSERTED.student_id AS id, INSERTED.name, INSERTED.address
       VALUES (@name, @address)`
    );
    return result.recordset[0];
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function updateStudent(id, updatedStudentData) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", id);
    request.input("name", updatedStudentData.name);
    request.input("address", updatedStudentData.address ?? "");
    const result = await request.query(
      `UPDATE Students
       SET name = @name, address = @address
       OUTPUT INSERTED.student_id AS id, INSERTED.name, INSERTED.address
       WHERE student_id = @id`
    );
    return result.recordset[0] || null;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

async function deleteStudent(id) {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(
      "DELETE FROM Students WHERE student_id = @id"
    );
    return result.rowsAffected[0] > 0;
  } catch (error) {
    console.error("Database error:", error);
    throw error;
  } finally {
    if (connection) await connection.close();
  }
}

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};