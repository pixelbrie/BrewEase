// Role definitions
export const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  BARISTA: 'barista',
  KITCHEN: 'kitchen'
};

// Permission matrix for each role
export const ROLE_PERMISSIONS = {
  admin: [
    'manage_users',
    'manage_roles',
    'view_analytics',
    'manage_tenants',
    'manage_settings',
    'manage_inventory',
    'view_all_orders',
    'manage_staff'
  ],
  manager: [
    'manage_staff',
    'view_reports',
    'manage_inventory',
    'view_orders',
    'manage_menu'
  ],
  barista: [
    'view_orders',
    'update_order_status',
    'view_menu'
  ],
  kitchen: [
    'view_orders',
    'update_order_status',
    'view_menu'
  ]
};

// Route protection by minimum required role
export const ROUTE_PROTECTION = {
  '/admin': ROLES.ADMIN,
  '/settings': ROLES.ADMIN,
  '/users': ROLES.ADMIN,
  '/manager': ROLES.MANAGER,
  '/reports': ROLES.MANAGER,
  '/staff': ROLES.MANAGER,
  '/inventory': ROLES.MANAGER,
  '/orders': ROLES.BARISTA,
  '/menu': ROLES.BARISTA
};