CREATE DATABASE vet_clinic;
USE vet_clinic;

CREATE TABLE Owner (
    login VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    owner_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    address VARCHAR(100)
);

CREATE TABLE Veterinarian (
    login VARCHAR(50) UNIQUE,
    password VARCHAR(255),
    vet_id INT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50)
);

CREATE TABLE Animal (
    animal_id INT PRIMARY KEY,
    species VARCHAR(50),
    animal_name VARCHAR(50),
    owner_id VARCHAR(20),
    vet_id INT,
    last_visit DATE,
    FOREIGN KEY (owner_id) REFERENCES Owner(owner_id),
    FOREIGN KEY (vet_id) REFERENCES Veterinarian(vet_id)
);

CREATE TABLE wlasciciel_zwierze (
    owner_id CHAR(11),
    animal_id INT,
    PRIMARY KEY (owner_id, animal_id),
    FOREIGN KEY (owner_id) REFERENCES owner(owner_id),
    FOREIGN KEY (animal_id) REFERENCES animal(animal_id)
);

CREATE TABLE Veterinarian_Availability (
    vet_id INT,
    mon VARCHAR(50),
    tue VARCHAR(50),
    wed VARCHAR(50),
    thu VARCHAR(50),
    fri VARCHAR(50),
    sat VARCHAR(50),
    sun VARCHAR(50),
    FOREIGN KEY (vet_id) REFERENCES Veterinarian(vet_id)
);

CREATE TABLE Visit (
    visit_id INT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    vet_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'DONE') DEFAULT 'PENDING',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (animal_id) REFERENCES Animal(animal_id),
    FOREIGN KEY (vet_id) REFERENCES Veterinarian(vet_id)
);