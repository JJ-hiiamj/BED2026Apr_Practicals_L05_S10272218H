# Polytechnic Library API

Backend API for the Polytechnic Library System (Node.js + Express + SQL Server).

## Setup

1. **Install dependencies**
   ```
   npm install
   ```

2. **Set up the database**
   - Open SQL Server Management Studio (or Azure Data Studio)
   - Run `sql/setup.sql` — this creates the `PolytechnicLibrary` database and the `Users`/`Books` tables, plus seeds a few sample books.

3. **Configure environment variables**
   - Copy `.env.example` to `.env`
   - Fill in your actual SQL Server credentials and a JWT secret:
     ```
     cp .env.example .env
     ```

4. **Run the server**
   ```
   npm run dev
   ```
   (or `npm start` if you don't have nodemon)

   You should see:
   ```
   Connected to SQL Server
   Server running on http://localhost:3000
   ```

## Testing the endpoints

Use Postman, Insomnia, or curl.

### 1. Register a librarian
```
POST /register
Content-Type: application/json

{
  "username": "librarian1",
  "password": "password123",
  "role": "librarian"
}
```

### 2. Register a member
```
POST /register
Content-Type: application/json

{
  "username": "student1",
  "password": "password123",
  "role": "member"
}
```

### 3. Login (get a JWT token)
```
POST /login
Content-Type: application/json

{
  "username": "librarian1",
  "password": "password123"
}
```
Response: `{ "token": "eyJhbGciOi..." }`

Copy this token — you'll need it for the next requests.

### 4. Get all books (member or librarian)
```
GET /books
Authorization: Bearer <paste token here>
```

### 5. Update book availability (librarian only)
```
PUT /books/1/availability
Authorization: Bearer <librarian token here>
Content-Type: application/json

{
  "availability": "N"
}
```

If you try this with a **member's** token instead, you should get a `403 Forbidden`.

## Project structure
```
library-api/
├── db/
│   ├── dbConfig.js            # SQL Server connection pool
│   ├── userModel.js      # Users table queries
│   └── bookModel.js      # Books table queries
├── middleware/
│   └── auth.js           # JWT verification + role-based authorization
├── routes/
│   ├── authRoutes.js      # /register, /login
│   └── bookRoutes.js      # /books, /books/:bookId/availability
├── sql/
│   └── setup.sql          # Database + table creation script
├── .env.example
├── package.json
└── server.js
```

## Notes on the design

- Passwords are hashed with `bcryptjs` before being stored — the database never sees plaintext passwords.
- JWTs carry `{ id, role }` and expire after 1 hour.
- The `verifyJWT` middleware checks the token is valid; the `authorizeRoles` middleware separately checks the decoded role is allowed for that route. Splitting these two concerns makes it easy to reuse `verifyJWT` on any route and just change which roles are allowed.
- SQL queries use parameterized inputs (`.input(...)`) rather than string concatenation, which protects against SQL injection.
