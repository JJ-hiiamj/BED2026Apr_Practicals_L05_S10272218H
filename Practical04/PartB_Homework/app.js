require("dotenv").config({ path: "./student-api.env" });
const express = require("express");
const sql = require("mssql");
const path = require("path");
const dbConfig = require("./dbConfig"); // now reads env correctly
const studentController = require("./Controllers/studentController");
const {
  validateStudent,
  validateStudentId,
} = require("./Middlewares/studentValidation");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to database"))
  .catch(err => console.error("❌ Connection failed:", err.message));


// Routes
app.get("/students", studentController.getAllStudents);
app.get("/students/:id", validateStudentId, studentController.getStudentById);
app.post("/students", validateStudent, studentController.createStudent);
app.put("/students/:id", validateStudentId, validateStudent, studentController.updateStudent);
app.delete("/students/:id", validateStudentId, studentController.deleteStudent);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Server shutting down...");
  await sql.close();
  console.log("DB Config:", dbConfig);
  console.log("Database connections closed");
  process.exit(0);
});
