const Role = require('./Role');

class Employee extends Role {
    constructor(first_name, last_name, title, salary, dept_name, manager) {
        super(title, salary, dept_name);
        this.first_name = first_name;
        this.last_name = last_name;
        this.manager = manager;
    }

    getInfo() {
        return {
            first_name: this.first_name,
            last_name: this.last_name,
            manager: this.manager,
            roleInfo: this.getRoleInfo(),
        }
    }
}

module.exports = Employee;