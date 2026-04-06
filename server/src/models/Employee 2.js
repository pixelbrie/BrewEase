export default class Employee{
  constructor({ employeeId, firstName, lastName, email, phone, roleId, pinHash, active=true }){
    this.employeeId = employeeId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.phone = phone || null;
    this.roleId = roleId;
    this.pinHash = pinHash;
    this.active = active;
  }
}
