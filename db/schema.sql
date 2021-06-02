DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

CREATE TABLE departments (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE roles (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(6) NOT NULL,
    dept_id INTEGER NOT NULL,
    CONSTRAINT fk_dept 
        FOREIGN KEY (dept_id)
        REFERENCES departments(id) 
        ON DELETE CASCADE
);

CREATE TABLE employees (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER REFERENCES employees(id),
    CONSTRAINT fk_role 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id)
        ON DELETE CASCADE
);

