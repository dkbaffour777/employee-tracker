const connection = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const Department = require('./Department');

class Role extends Department {
    deleteRole(questions, func) {
        inquirer
            .prompt(questions).then((answers) => {
                const { role } = answers;
                const role_id = parseInt(role.split(" ")[0]);

                const sql = `DELETE FROM roles WHERE id = ?`;
                connection.query(sql, role_id, (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                    func();
                });
            })
    }
}

module.exports = Role;