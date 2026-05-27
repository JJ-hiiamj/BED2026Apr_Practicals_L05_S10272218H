module.exports = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  trustServerCertificate: true,
  options: {
    trustServerCertificate: true,
    port: parseInt(process.env.DB_PORT), // Converts the string "1433" to a number
    connectionTimeout: 60000, 
  },
};