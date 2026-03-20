export default class Role{
  constructor({ roleId, roleName, permissions }) {
    this.roleId = roleId;
    this.roleName = roleName;
    this.permissions = permissions;
  }
}