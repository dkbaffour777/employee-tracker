const connection = require('../db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

class Department {
    
    deleteDepartment(questions) {
        inquirer
            .prompt(questions).then((answers) => {
                const { department } = answers;
                const dept_id = parseInt(department.split(" ")[0]);

                const sql = `DELETE FROM departments WHERE id = ?`;
                connection.query(sql, dept_id, (err, rows, emp_fields) => {
                    if (err) throw err;
                    console.table(rows);
                });
            })
    }
}

module.exports = Department;