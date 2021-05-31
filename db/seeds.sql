INSERT INTO departments(name)
VALUES 
    ('Sales'),           -- 1
    ('Finance'),         -- 2
    ('Engineering'),     -- 3
    ('Legal');           -- 4

INSERT INTO roles(title, salary, dept_id)
VALUES
    ('Sales Lead', 100000, 1),          -- 1 manager
    ('Salesperson', 80000, 1),          -- 2
    ('Lead Engineer', 150000, 3),       -- 3 manager
    ('Software Engineer', 120000, 3),   -- 4
    ('Accountant', 125000, 2),          -- 5
    ('Legal Team Lead', 250000, 4),     -- 6 manager
    ('Lawyer', 190000, 4);              -- 7

INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
    ('Daniel', 'Baffour', 3, NULL),     -- 1
    ('Michael', 'Catchings', 7, 4),     -- 2
    ('Sarah', 'Johnson', 5, NULL),      -- 3
    ('Michelle', 'Bimbo', 6, NULL),     -- 4
    ('Randy', 'Spikes', 4, 1),          -- 5
    ('Maria', 'Gisselle', 2, 7),        -- 6
    ('John', 'Doe', 1, NULL),           -- 7
    ('Kelvin', 'Kuffour', 4, 1),        -- 8
    ('Brenda', 'White', 2, 7),          -- 9
    ('Martha', 'Guiterez', 7, 4);       -- 10


