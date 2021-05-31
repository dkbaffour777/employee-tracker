const Employee = require('../lib/Employee');

test("Creates a new employee object", () => {
    const emp = new Employee("Sarah", "Johnson", "Sales Lead", 200000, "Sales", null);

    expect(emp.getInfo()).toEqual({
        first_name: "Sarah",
        last_name: "Johnson",
        manager: null,
        roleInfo: {
            department: "Sales",
            salary: 200000,
            title: "Sales Lead"
        }
    });

    const emp1 = new Employee("Sandra", "Wilson", "Salesperson", 100000, "Sales", emp);

    expect(emp1.getInfo()).toEqual({
        first_name: "Sandra",
        last_name: "Wilson",
        manager: emp,
        roleInfo: {
            department: "Sales",
            salary: 100000,
            title: "Salesperson"
        }
    });
});