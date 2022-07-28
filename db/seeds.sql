use employee_tracker_db;


INSERT INTO department (dept_name)
VALUES ("Executive"), ("Administrative"), ("Manufacturing"), ("Engineering"), ("Accounting");

INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", 400000, 1), ("Manager", 120000, 2), ("Laborer", 60000, 3), ("Engineer", 200000, 4), ("Payroll", 150000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Leah", "Villa", 1, 4), ("Haley", "Fernandes", 2, 2), ("August", "Payton", 3, 3), ("Jason", "Heacox", 4, 2), ("Joe", "Snow", 5, 4);







