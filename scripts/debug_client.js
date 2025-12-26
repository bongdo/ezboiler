import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { readFile } from 'fs/promises';
// Polyfill fetch and maybe dom?
// Actually simpler to just use node environment, firebase js sdk works in node usually if 
// we use the right imports or just use admin sdk? 
// no, point is to use client sdk to see if API key works.

// We need to read the config.js which is ES6 export default.
// simpler to just parse the values again from env or use the generate script's logic.

async function test() {
    try {
        console.log('Loading config from ../config.js...');
        // We use dynamic import for the ES module config
        const configModule = await import('../config.js');
        const config = configModule.default;

        console.log('Testing with Project:', config.projectId);


        const app = initializeApp(config);
        const db = getFirestore(app);

        console.log('Attempting to read brands...');
        const brands = await getDocs(collection(db, 'brands'));
        console.log(`Success! Found ${brands.size} brands.`);
        
        console.log('Attempting to read 1 product...');
        const products = await getDocs(collection(db, 'products'));
        console.log(`Success! Found ${products.size} products.`);

    } catch (e) {
        console.error('ERROR:', e.message);
        console.error('Code:', e.code);
    }
}

test();
