import Role from './Role.js'; // We can import it with the { } because we exported it as a default class, meaning that, it'll be the default class that gets exported unless we declared another specific class, thereby, we could TECHNICALLY name it whatever we want but, just for simplicity, we keep it the same name.
import Employee from './Employee.js';
import Customer from './Customer.js';

export { Role, Employee, Customer }

/* Documentation Used:
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes (JavaScript - Classes)
https://firebase.google.com/docs/firestore/manage-data/data-types (Firebase - Supported data types)
https://firebase.google.com/docs/firestore/manage-data/add-data (Firebase - Add data to Cloud Firestore)
https://firebase.google.com/docs/data-connect/data-seeding-bulk-operations (Firebase - Seed data and perform bulk data operations)
*/