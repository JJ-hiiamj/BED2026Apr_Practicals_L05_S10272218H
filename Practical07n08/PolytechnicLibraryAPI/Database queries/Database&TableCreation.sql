USE PolytechnicLibrary;
GO

CREATE TABLE Users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    passwordHash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('member', 'librarian'))
);
GO

CREATE TABLE Books (
    book_id INT IDENTITY(1,1) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    availability CHAR(1) NOT NULL CHECK (availability IN ('Y', 'N'))
);
GO

INSERT INTO Books (title, author, availability) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Y'),
('1984', 'George Orwell', 'N'),
('To Kill a Mockingbird', 'Harper Lee', 'Y');
GO