// TODO: Prolly add this into a specific scripts folder since it's something you activate on it's own.
import { db } from '../config/firebaseAdmin.js';
import { Role, Employee } from '../models/index.js'; // TODO: Add customer stuff too

async function seedDatabase (){
  const batch = db.batch();

  // Creating test role
  const newRole = new Role('role_123', 'Barissta', ['create_order', 'view_menu']) // TODO: Add specific permissions
  const roleRef = db.collection('roles').doc(newRole.roleId);
  batch.set(roleRef, { ...newRole }); // TODO: Add explanation of batch + set to better understand exactly what's happening.

  // TODO: Create test employee

  try {
    await batch.commit();
    console.log('BrewEase seed data successfully added.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database: ', error);
    process.exit(1);
  }
}

seedDatabase();