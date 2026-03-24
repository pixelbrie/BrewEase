// teardown.js: deletes all documents containing 'test_', which solely spawn from seed.js test data.
// TODO: Finish explanations for unique pieces of code.
import { db } from '../config/firebaseAdmin.js';
import { FieldPath } from 'firebase-admin/firestore';

async function clearSeedData() {
  console.log('Starting the teardown.js process...')
  let totalDocsDeleted = 0;

  try {
    const collections = await db.listCollections();
    console.log(`Found ${collections.length} collections to check.`);

    for (const collectionRef of collections) {
      const collectionName = collectionRef.id;
      console.log(`-----`)
      console.log(`Checking collection \'${collectionName}\'...`)

      const startOfPrefix = 'test_';
      const endOfPrefix = 'test_' + '\uf8ff'; // This is a unicode char that will... TODO: FINISH EXPLANATION

      const querySnapshot = await collectionRef
        .orderBy(FieldPath.documentId())
        .startAt(startOfPrefix)
        .endAt(endOfPrefix)
        .get();

      if (querySnapshot.empty) {
        console.log(`No test data was found in collection \'${collectionName}\'.`)
        continue;
      }

      console.log(`Found ${querySnapshot.size} test documents in collection \'${collectionName}\'.`);

      let batch = db.batch();
      let operationCount = 0;

      for (const docSnapshot of querySnapshot.docs) {
        batch.delete(docSnapshot.ref);
        operationCount++;
        totalDocsDeleted++;

        if (operationCount === 500) { // On the rare chance we overflow the max batch amount.
          console.log(`Commiting batch of 500 deletes in collection \'${collectionName}\'.`);
          await batch.commit();
          batch = db.batch(); // Resets batch
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        console.log(`Committing ${operationCount} deletes in collection \'${collectionName}\'.`);
        await batch.commit();
      }
    }

    console.log(`\nTeardown process complete. Successfully deleted ${totalDocsDeleted} test documents!`);
    process.exit(0);

  } catch (error) {
    console.error(`Error during teardown process: ${error}`);
    process.exit(1);
  }
}
clearSeedData();
/* Documentation:
https://firebase.google.com/docs/firestore/manage-data/delete-data - Delete data from Cloud Firestore
https://firebase.google.com/docs/firestore/query-data/queries - Queries (specifically queries + query operators)
*/