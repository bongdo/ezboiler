import admin from 'firebase-admin';
import { readFile } from 'fs/promises';

const SERVICE_ACCOUNT_PATH = './ezbioler-ru-firebase-adminsdk-fbsvc-eb54089863.json';

async function verify() {
  const serviceAccount = JSON.parse(await readFile(SERVICE_ACCOUNT_PATH, 'utf-8'));
  admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
  });
  
  const db = admin.firestore();
  
  console.log('Verifying specific product: 0.006.245');
  const doc = await db.collection('products').doc('0.006.245').get();

  if (!doc.exists) {
      console.log('Product 0.006.245 not found!');
  } else {
      console.log('Found:', doc.data());
  }
}

verify().catch(console.error);
