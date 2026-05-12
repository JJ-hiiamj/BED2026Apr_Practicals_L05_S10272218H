module.exports = {
  user: "student_api", // Replace with your SQL Server login username
  password: "12345", // Replace with your SQL Server login password
  server: "localhost",
  database: "student_api_db",
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};