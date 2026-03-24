// TODO: Prolly add this into a specific scripts folder since it's something you activate on it's own.
import { db } from '../config/firebaseAdmin.js';
import { Role, Employee } from '../models/index.js'; // TODO: Add customer stuff too

async function seedDatabase (){
  const batch = db.batch();

  // Creating test role
  // Fields: (roleId, roleName, permissions)
  const newRole = new Role({
    roleId: "test_role_001",
    roleName: "Barista",
    permissions: ["create_order", "view_menu"]
  });
  const roleRef = db.collection('roles').doc(newRole.roleId);
  batch.set(roleRef, { ...newRole }); // The ... is basically writing the roleId: "", roleName: "", etc., it just writes out what you already have in newRole.

  // TODO: Create test employee
  // Fields: (employeeId, firstName, lastName, email, phone, roleId, pinHash, active=true)
  const newEmployee = new Employee({
    employeeId: "test_employee_001",
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phone: "305-111-1111",
    roleId: "test_role_001",
    pinHash: "0"
  });
  const employeeRef = db.collection('employees').doc(newEmployee.employeeId);
  batch.set(employeeRef, { ...newEmployee });

  try {
    await batch.commit(); // Sends all the queued writes together. If one operation fails, the whole batch fails (to help avoid partial writing.)
    console.log('BrewEase seed data successfully added.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database: ', error);
    process.exit(1);
  }
}

seedDatabase();