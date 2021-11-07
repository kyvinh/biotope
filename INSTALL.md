## Database

### Init
CREATE DATABASE biotest;
CREATE USER 'biouser'@'localhost' IDENTIFIED BY 'password';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, INDEX, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON biotest.* TO 'biouser'@'localhost';
