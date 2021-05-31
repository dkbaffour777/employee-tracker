const Department = require('../lib/Department');

test('Creates a new department object', () => {
    const dept = new Department("Engineering");

    expect(dept.getDeptName()).toBe("Engineering");
})