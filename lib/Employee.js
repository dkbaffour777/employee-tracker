const Role = require('./Role');
const inquirer = require('inquirer');
const cTable = require('console.table');
const connection = require('../db/connection');

class Employee extends Role {

    updateEmployeeRole(questions, func) {
        inquirer
            .prompt(questions).then((answers) => {
                const { employee, new_role } = answers;
                const emp_id = parseInt(employee.split(" ")[0]);
                const role_id = parseInt(new_role.split(" ")[0]);

                const sql = `UPDATE employees SET role_id = ? WHERE id = ?`;
                connection.query(sql, [role_id, emp_id], (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                    func();
                });
            })
    }

    updateEmployeeManager(questions, func) {
        inquirer
            .prompt(questions).then((answers) => {
                const { employee, new_manager } = answers;
                const emp_id = parseInt(employee.split(" ")[0]);
                const manager_id = (new_manager.toLowerCase() !== "no manager") ? parseInt(new_manager.split(" ")[0]) : null;

                //console.log(emp_id, manager_id)

                const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
                connection.query(sql, [manager_id, emp_id], (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                    func();
                });
            })
    }

    deleteEmployee(questions, func) {
        inquirer
            .prompt(questions).then((answers) => {
                const { employee } = answers;
                const emp_id = parseInt(employee.split(" ")[0]);

                const sql = `DELETE FROM employees WHERE id = ?`;
                connection.query(sql, emp_id, (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                    func();
                });
            })
    }
}

module.exports = Employee;