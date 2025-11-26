CREATE DATABASE agenda;

\c agenda;

CREATE TABLE contactos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(150) NOT NULL,
    telefono VARCHAR(20) NOT NULL,
    empresa VARCHAR(150),
    puesto VARCHAR(150),
    email VARCHAR(150),
    linkedin VARCHAR(255)
);
