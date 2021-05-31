const Department = require('./Department');

class Role extends Department{
    constructor(title, salary, dept_name) {
        super(dept_name);
        this.title = title;
        this.salary = salary;
    }

    getRoleInfo() {
        return {
            title: this.title,
            salary: this.salary,
            department: this.getDeptName(),
        }
    }
}

module.exports = Role;