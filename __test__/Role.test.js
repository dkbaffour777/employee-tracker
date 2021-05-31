const Role = require('../lib/Role');

test('Creates a new role object', () => {
    const role = new Role("Accountant", 150000, "Sales");

    expect(role.getRoleInfo()).toEqual({title: "Accountant", salary: 150000, department: "Sales"});
})