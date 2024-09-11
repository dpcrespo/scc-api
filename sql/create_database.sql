CREATE DATABASE ctb;

USE ctb;

DROP TABLE User;

DELETE FROM ctb.User WHERE email='dpcrespo@gmail.com';

CREATE TABLE User (
	id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    email VARCHAR(100),
    password VARCHAR(255),
    first_name VARCHAR(100),
    first_surname VARCHAR(100),
    second_surname VARCHAR(100),
    date_of_birth DATE,
    document_id VARCHAR(100),
    genre ENUM('Male', 'Female'),
    license VARCHAR(100),
    registered_id VARCHAR(100),
    phone_number VARCHAR(100),
    role_id INT NOT NULL DEFAULT 2,
    enabled BOOLEAN,
    foreign key (role_id) REFERENCES Role(id)
);

CREATE TABLE Role (
	id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE CHECK (NAME IN ('Admin', 'User'),
);
    
SELECT * FROM ctb.User;