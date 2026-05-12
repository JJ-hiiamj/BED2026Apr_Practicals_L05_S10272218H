const express = require("express");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // middleware inbuilt in express to recognize the incoming Request Object as a JSON Object.
app.use(express.urlencoded()); // middleware inbuilt in express to recognize the incoming Request Object as strings or arrays

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});

// --- CRUD ROUTES ---

// 1. GET ALL STUDENTS
app.get("/students", async (req, res) => {
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request().query("SELECT * FROM Students");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).send("Error retrieving students");
  } finally {
    if (connection) await connection.close();
  }
});

// 2. GET STUDENT BY ID
app.get("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, studentId)
      .query("SELECT * FROM Students WHERE student_id = @id");

    if (result.recordset.length === 0) return res.status(404).send("Student not found");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send("Error retrieving student");
  } finally {
    if (connection) await connection.close();
  }
  //error message
  if (result.recordset.length === 0) {
  return res.status(404).json({ message: "Student not found" });
  }
  res.json({ message: "Student retrieved successfully", student: result.recordset[0] });
});

// 3. POST (CREATE) STUDENT
app.post("/students", async (req, res) => {
  const { name, address } = req.body;
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    // Insert and get the new ID in one go
    const insertQuery = `
      INSERT INTO Students (name, address) 
      VALUES (@name, @address); 
      SELECT SCOPE_IDENTITY() AS student_id;`;
    
    const result = await connection.request()
      .input("name", sql.VarChar, name)
      .input("address", sql.VarChar, address)
      .query(insertQuery);

    const newId = result.recordset[0].student_id;
    
    // Fetch and return the new student
    const newStudent = await connection.request()
      .input("id", sql.Int, newId)
      .query("SELECT * FROM Students WHERE student_id = @id");

    res.status(201).json(newStudent.recordset[0]);
  } catch (err) {
    res.status(500).send("Error creating student");
  } finally {
    if (connection) await connection.close();
  }
  //error message
  res.status(201).json({ message: "Student created successfully", student: newStudent.recordset[0] });
  res.status(500).json({ message: "Error creating student", error: err.message });
});

// 4. PUT (UPDATE) STUDENT
app.put("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  const { name, address } = req.body;
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, studentId)
      .input("name", sql.VarChar, name)
      .input("address", sql.VarChar, address)
      .query("UPDATE Students SET name = @name, address = @address WHERE student_id = @id");

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");

    const updatedStudent = await connection.request()
      .input("id", sql.Int, studentId)
      .query("SELECT * FROM Students WHERE student_id = @id");

    res.json(updatedStudent.recordset[0]);
  } catch (err) {
    res.status(500).send("Error updating student");
  } finally {
    if (connection) await connection.close();
  }

  // error message
  if (result.rowsAffected[0] === 0) {
  return res.status(404).json({ message: "Student not found" });
  }
  res.json({ message: "Update successful", student: updatedStudent.recordset[0] });
  res.status(500).json({ message: "Error updating student", error: err.message });
});

// 5. DELETE STUDENT
app.delete("/students/:id", async (req, res) => {
  const studentId = parseInt(req.params.id);
  let connection;
  try {
    connection = await sql.connect(dbConfig);
    const result = await connection.request()
      .input("id", sql.Int, studentId)
      .query("DELETE FROM Students WHERE student_id = @id");

    if (result.rowsAffected[0] === 0) return res.status(404).send("Student not found");
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Error deleting student");
  } finally {
    if (connection) await connection.close();
  }
  //error message
  if (result.rowsAffected[0] === 0) {
  return res.status(404).json({ message: "Student not found" });
  }
  res.json({ message: "Deletion successful" });
  res.status(500).json({ message: "Error deleting student", error: err.message });
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  await sql.close();
  process.exit(0);
});