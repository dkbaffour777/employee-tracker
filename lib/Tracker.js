const inquirer = require('inquirer');
let connection = require('../db/connection');
const cTable = require('console.table');
const Employee = require('./Employee');

class Tracker extends Employee{
    
    track() {
        const operationOptions = [
                {
                    operation: 'View all departments',
                    execute: (tracker) => {
                        tracker.select('SELECT * FROM departments ORDER BY id')
                    } 
                },
                {
                    operation: 'View all roles',
                    execute: (tracker) => {
                        tracker.select('SELECT roles.id, roles.title, departments.name as department, roles.salary FROM roles LEFT JOIN departments ON roles.dept_id = departments.id')
                    } 
                },
                {
                    operation: 'View all employees',
                    execute: (tracker) => {
                        tracker.select('SELECT table1.id, table1.first_name, table1.last_name, table1.title, table1.dept_name, table1.salary, managers.manager_name FROM (SELECT employees.id, employees.first_name, employees.last_name, roles.title, employees.manager_id, departments.name AS dept_name, roles.salary FROM employees LEFT JOIN roles  ON employees.role_id = roles.id LEFT JOIN departments ON roles.dept_id = departments.id) AS table1 LEFT JOIN (SELECT id, CONCAT(first_name, " ", last_name) as manager_name FROM employees) AS managers ON table1.manager_id = managers.id')
                    } 
                },
                {
                    operation: 'View employees by manager',
                    execute: (tracker) => {
                        tracker.select('SELECT emp.first_name, emp.last_name, managers.manager FROM employees AS emp  LEFT JOIN (SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees) AS managers ON emp.manager_id = managers.id GROUP BY emp.id, managers.id HAVING managers.manager IS NOT NULL ORDER BY managers.manager')
                    } 
                },
                {
                    operation: 'View employees by department',
                    execute: (tracker) => {
                        tracker.select('SELECT emp.first_name, emp.last_name, departments.name AS department FROM employees AS emp  LEFT JOIN roles ON emp.role_id = roles.id LEFT JOIN departments ON departments.id = roles.dept_id GROUP BY emp.id, departments.name ORDER BY departments.name')
                    } 
                },
                {
                    operation: 'View the total utilized budget of each department',
                    execute: (tracker) => {
                        tracker.select('SELECT departments.name, SUM(roles.salary) AS total_budget FROM employees LEFT JOIN roles ON employees.role_id = roles.id LEFT JOIN departments ON  roles.dept_id = departments.id GROUP BY departments.id')
                    } 
                },
                {
                    operation: 'Add a department',
                    execute: (tracker) => {
                        const question = [
                            {
                                type: 'input',
                                name: 'dept_name',
                                message: `Please enter the name of the department: (Required)`,
                                validate: dept_name => {
                                    if (dept_name) {
                                        return true;
                                    } else {
                                        console.log(` Error => Please fill out the name of the department!`);
                                        return false;
                                    }
                                }
                            },
                        ]
                        tracker.insert('departments', ['name'], question)
                    }
                },
                {
                    operation: 'Add a role',
                    execute: (tracker) => {
                        connection.query('SELECT * FROM departments', (err, rows, emp_fields) => {
                            if (err) throw err;
                            const departments = rows.map(ele => `${ele.id} --- ${ele.name}`);
                            const questions = [
                                {
                                    type: 'input',
                                    name: 'title',
                                    message: `Please enter the title of the role: (Required)`,
                                    validate: title => {
                                        if (title) {
                                            return true;
                                        } else {
                                            console.log(` Error => Please fill out the title of the role!`);
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'number',
                                    name: 'salary',
                                    message: `Please enter the salary of the role: (Required)`,
                                    validate: salary => {
                                        if (salary) {
                                            return true;
                                        } else {
                                            console.log(` Error => Please fill out the salary of the role!`);
                                            return false;
                                        }
                                    }
                                },
                                {
                                    type: 'list',
                                    name: 'employees',
                                    message: 'Select the department under which the role falls?',
                                    choices: departments,
                                    filter: (val) => {
                                        return val.toLowerCase();
                                    },
                                },
                            ]
                            tracker.insert('roles', ['title', 'salary', 'dept_id'], questions);
                        });
                    }
                },
                {
                    operation: 'Add an employee',
                    execute: (tracker) => {
                        connection.query('SELECT id, title FROM roles', (err, rows, fields) => {
                            if (err) throw err;
                            const roles = rows.map(ele => `${ele.id} --- ${ele.title}`);
                            connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS manager FROM employees', (err, rows, fields) => {
                                if (err) throw err;
                                const employees = rows.map(ele => `${ele.id} --- ${ele.manager}`);
                                employees.push("No manager")
                                const questions = [
                                    {
                                        type: 'input',
                                        name: 'first_name',
                                        message: `Please enter the first name of the employee: (Required)`,
                                        validate: first_name => {
                                            if (first_name) {
                                                return true;
                                            } else {
                                                console.log(` Error => Please fill out the first name of the employee!`);
                                                return false;
                                            }
                                        }
                                    },
                                    {
                                        type: 'input',
                                        name: 'last_name',
                                        message: `Please enter the last name of the employee: (Required)`,
                                        validate: last_name => {
                                            if (last_name) {
                                                return true;
                                            } else {
                                                console.log(` Error => Please fill out the last name of the employee!`);
                                                return false;
                                            }
                                        }
                                    },
                                    {
                                        type: 'list',
                                        name: 'role',
                                        message: 'Select the employee\'s role',
                                        choices: roles,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                    {
                                        type: 'list',
                                        name: 'manager',
                                        message: 'Select the employee\'s manager',
                                        choices: employees,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                ]
                                tracker.insert('employees', ['first_name', 'last_name', 'role_id', 'manager_id'], questions);
                            });
                        });
                    }
                },
                {
                    operation: 'Update an employee',
                    execute: (tracker) => {
                        connection.query('SELECT id, title FROM roles', (err, rows, fields) => {
                            if (err) throw err;
                            const roles = rows.map(ele => `${ele.id} --- ${ele.title}`);
                            connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, rows, fields) => {
                                if (err) throw err;
                                const employees = rows.map(ele => `${ele.id} --- ${ele.name}`);
                                const questions = [
                                    {
                                        type: 'list',
                                        name: 'employee',
                                        message: 'Select an employee to update role',
                                        choices: employees,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                    {
                                        type: 'list',
                                        name: 'new_role',
                                        message: 'Select the new role of the employee',
                                        choices: roles,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                ]
                                tracker.updateEmployeeRole(questions, tracker.track);
                            });
                        });
                    }
                },
                {
                    operation: 'Update employee manager',
                    execute: (tracker) => {
                        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, rows, fields) => {
                            if (err) throw err;
                            const employees = rows.map(ele => `${ele.id} --- ${ele.name}`);
                            connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, rows, fields) => {
                                if (err) throw err;
                                const potententialManagers = rows.map(ele => `${ele.id} --- ${ele.name}`);
                                potententialManagers.push("No manager");
                                const questions = [
                                    {
                                        type: 'list',
                                        name: 'employee',
                                        message: 'Select an employee to update manager',
                                        choices: employees,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                    {
                                        type: 'list',
                                        name: 'new_manager',
                                        message: 'Select the new manager of the employee',
                                        choices: potententialManagers,
                                        filter: (val) => {
                                            return val.toLowerCase();
                                        },
                                    },
                                ]
                                tracker.updateEmployeeManager(questions, tracker.track);
                            });
                        });
                    }
                },
                {
                    operation: 'Delete department',
                    execute: (tracker) => {
                        connection.query('SELECT id, name FROM departments', (err, rows, fields) => {
                            if (err) throw err;
                            const departments = rows.map(ele => `${ele.id} --- ${ele.name}`);
                            const questions = [
                                {
                                    type: 'list',
                                    name: 'department',
                                    message: 'Select a department to remove',
                                    choices: departments,
                                    filter: (val) => {
                                        return val.toLowerCase();
                                    },
                                },
                            ]
                            tracker.deleteDepartment(questions, tracker.track);
                        });
                    }
                },
                {
                    operation: 'Delete role',
                    execute: (tracker) => {
                        connection.query('SELECT id, title FROM roles', (err, rows, fields) => {
                            if (err) throw err;
                            const roles = rows.map(ele => `${ele.id} --- ${ele.title}`);
                            const questions = [
                                {
                                    type: 'list',
                                    name: 'role',
                                    message: 'Select a role to remove',
                                    choices: roles,
                                    filter: (val) => {
                                        return val.toLowerCase();
                                    },
                                },
                            ]
                            tracker.deleteRole(questions, tracker.track);
                        });
                    }
                },
                {
                    operation: 'Delete employee',
                    execute: (tracker) => {
                        connection.query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees', (err, rows, fields) => {
                            if (err) throw err;
                            const employees = rows.map(ele => `${ele.id} --- ${ele.name}`);
                            const questions = [
                                {
                                    type: 'list',
                                    name: 'employee',
                                    message: 'Select an employee to remove',
                                    choices: employees,
                                    filter: (val) => {
                                        return val.toLowerCase();
                                    },
                                },
                            ]
                            tracker.deleteEmployee(questions, tracker.track);
                        });
                    }
                },
                {
                    operation: 'End program',
                    execute: (tracker) => {
                        console.log("Good bye!");
                        connection.end();
                    }
                },
        ]

        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'operation',
                    message: 'What would you like to do?',
                    choices: operationOptions.map(ele => ele.operation),
                    filter: (val) => {
                        return val.toLowerCase();
                    },
                },
            ]).then(result => {
                const query = operationOptions.filter(ele => ele.operation.toLowerCase() === result.operation.toLowerCase());
                if (query.length > 0) {
                    const result = query[0];
                    const tracker = _this();
                    result.execute(tracker);
                }
            })
    }

    select(sql) {
        connection.promise().query(sql)
            .then(([rows, fields]) => {
                console.table(rows);
                this.track()
            })
            .catch((error) => console.log(error.message))
    }

    insert(tableName, values, questions) {
        inquirer
            .prompt(questions).then((answers) => {
                const sql = `INSERT INTO ${tableName}(${values.join(',')}) VALUES (${values.length > 1 ? values.map(() => '?').join(',') : '?'})`;
                const params = Object.values(answers);

                // parse the third element into a number if the table name is roles
                if (tableName === "roles") params[2] = parseInt(params[2].split(" ")[0]);
                
                // check if new employee has a manager or not
                if (tableName === "employees") {
                    params[2] = parseInt(params[2].split(" ")[0]);
                    if(params[3].toLowerCase() === "no manager") {
                        params[3] = null;
                    }else params[3] = parseInt(params[3].split(" ")[0]);
                }

                connection.query(sql, params, (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                    this.track();
                });
            })
    }
}

function _this() {
    return new Tracker();
}
module.exports = Tracker;