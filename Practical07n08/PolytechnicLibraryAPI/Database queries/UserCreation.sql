-- Create a login at the server level
CREATE LOGIN library_app_user WITH PASSWORD = 'YourStrongPassword123!';

-- Create the database
CREATE DATABASE PolytechnicLibrary;
GO
USE PolytechnicLibrary;
GO

-- Create a user in that database mapped to the login
CREATE USER library_app_user FOR LOGIN library_app_user;

-- Grant it permissions
ALTER ROLE db_datareader ADD MEMBER library_app_user;
ALTER ROLE db_datawriter ADD MEMBER library_app_user;