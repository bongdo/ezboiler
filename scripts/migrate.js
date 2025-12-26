import Database from 'better-sqlite3';
import admin from 'firebase-admin';
import { readFile, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import mime from 'mime-types';
import path from 'path';

// --- Configuration ---
const DB_PATH = '../ezboiler.db';
const SERVICE_ACCOUNT_PATH = './ezbioler-ru-firebase-adminsdk-fbsvc-eb54089863.json';
const STORAGE_BUCKET = process.env.STORAGE_BUCKET || 'ezbioler-ru.appspot.com'; // Default bucket name

// --- Initialization ---
async function initFirebase() {
  if (existsSync(SERVICE_ACCOUNT_PATH)) {
    const serviceAccount = JSON.parse(await readFile(SERVICE_ACCOUNT_PATH, 'utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: STORAGE_BUCKET
    });
    console.log('Initialized Firebase with service-account.json');
  } else {
    // Attempt to use Application Default Credentials
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      storageBucket: STORAGE_BUCKET
    });
    console.log('Initialized Firebase with Default Credentials');
  }
}

// Helper to sanitize document IDs (remove slashes)
function sanitizeId(id) {
    return String(id).replace(/\//g, '_SLASH_');
}

// --- Data Migration ---
async function migrate() {
    console.log('Opening SQLite database...');
    const db = new Database(DB_PATH, { readonly: true });
    
    const firestore = admin.firestore();
    // const bucket = admin.storage().bucket(); // Not used for local extraction

    // 1. Migrate Brands
    console.log('Migrating Brands...');
    const brands = db.prepare('SELECT * FROM brands').all();
    const brandsBatch = firestore.batch();
    for (const brand of brands) {
        const ref = firestore.collection('brands').doc(sanitizeId(brand.id));
        brandsBatch.set(ref, { name: brand.name });
    }
    await brandsBatch.commit();
    console.log(`Migrated ${brands.length} brands.`);

    // 2. Migrate Boilers
    console.log('Migrating Boilers...');
    const boilers = db.prepare(`
        SELECT boilers.*, brands.name as brandName 
        FROM boilers 
        JOIN brands ON boilers.brand_id = brands.id
    `).all();
    const boilersBatch = firestore.batch();
    for (const boiler of boilers) {
        const ref = firestore.collection('boilers').doc(sanitizeId(boiler.id));
        boilersBatch.set(ref, {
            name: boiler.name,
            brandId: boiler.brand_id,
            brandName: boiler.brandName
        });
    }
    await boilersBatch.commit();
    console.log(`Migrated ${boilers.length} boilers.`);

    // 3. Migrate Part Types
    console.log('Migrating Part Types...');
    const partTypes = db.prepare('SELECT * FROM part_types').all();
    const partTypesBatch = firestore.batch();
    for (const type of partTypes) {
        const ref = firestore.collection('part_types').doc(sanitizeId(type.id));
        partTypesBatch.set(ref, { name: type.name });
    }
    await partTypesBatch.commit();
    console.log(`Migrated ${partTypes.length} part types.`);

    // 4. Migrate Products (Parts)
    // 4. Migrate Products (Parts)
    console.log('Migrating Products...');
    // Fetch all parts
    const parts = db.prepare(`
        SELECT parts.*, part_types.name as partTypeName
        FROM parts
        LEFT JOIN part_types ON parts.part_type_id = part_types.id
    `).all();

    // Helper to get compatible boilers for a part
    const getCompatibleBoilers = db.prepare('SELECT boiler_id FROM parts_boilers WHERE part_code = ?');
    
    // Helper to get image data
    const getImageData = db.prepare('SELECT image_data FROM product_images WHERE part_code = ?');

    let successCount = 0;
    let errorCount = 0;

    // Process in chunks to avoid batch limits or memory issues
    const chunkSize = 100;
    for (let i = 0; i < parts.length; i += chunkSize) {
        const chunk = parts.slice(i, i + chunkSize);
        const batch = firestore.batch();
        const uploadPromises = [];

        for (const part of chunk) {
            try {
                // Sanitize ID for the document key
                const docId = sanitizeId(part.vendor_code);
                const docRef = firestore.collection('products').doc(docId);  


                
                // Get compatible boilers and derive brands
                const boilerIdsObj = getCompatibleBoilers.all(part.vendor_code);
                const boilerIds = boilerIdsObj.map(row => row.boiler_id);
                
                // Just use boiler IDs to look up brands? 
                // We could optimize this by creating a lookup map for boilerId -> brandId earlier, 
                // but for now let's query the DB or use the loaded boilers list if small enough.
                // Let's use a quick lookup from our local boilers array.
                const compatibleBrandIds = new Set();
                for(const bid of boilerIds) {
                     const b = boilers.find(b => b.id === bid);
                     if (b) compatibleBrandIds.add(b.brand_id);
                }

                let imageUrl = part.image; // default from main table if path exists

                // Handle Image Extraction to Local FS
                const imageRow = getImageData.get(part.vendor_code);
                if (imageRow && imageRow.image_data) {
                     const buffer = imageRow.image_data;
                     // Simple type detection
                     let ext = 'jpg';
                     if (buffer[0] === 0x89 && buffer[1] === 0x50) ext = 'png';
                     
                     const filename = `${sanitizeId(part.vendor_code)}.${ext}`;
                     const localPath = path.join('../frontend/public/products', filename);
                     
                     // Write to file system
                     // We can do this async but need to wait or fire-and-forget? 
                     // Let's fire-and-forget for speed but catch errors. 
                     // Actually better to wait to ensure we don't overwhelm FS
                     uploadPromises.push(
                         writeFile(localPath, buffer).then(() => {
                             return `/products/${filename}`;
                         }).catch(err => {
                             console.error(`Failed to write local image for ${part.vendor_code}:`, err.message);
                             return null;
                         }).then(url => ({ vid: part.vendor_code, url }))
                     );
                }

                const docData = {
                    vendorCode: part.vendor_code,
                    name: part.name,
                    description: part.description || '',
                    price: part.price || 0,
                    quantity: part.quantity || 0,
                    isUsed: !!part.is_used,
                    originalBrandId: part.original_brand_id || null,
                    partTypeId: part.part_type_id || null,
                    partTypeName: part.partTypeName || '',
                    compatibleBoilerIds: boilerIds,
                    compatibleBrandIds: Array.from(compatibleBrandIds),
                    inPriceList: !!part.in_price_list,
                    // We will set imageUrl below after uploads resolve for this chunk? 
                    // No, batch writes are synchronous in definition. 
                    // We need to resolve uploads first if we want the URL in the doc.
                    // Or we can update the doc later with the URL. 
                    // Let's do a two-pass for images or wait.
                };
                
                // Temporary store data to add to batch after image resolution
                part._docData = docData;

            } catch (err) {
                console.error(`Error preparing part ${part.vendor_code}:`, err);
                errorCount++;
            }
        }
        
        // Wait for all images in this chunk to upload
        const results = await Promise.all(uploadPromises);
        const urlMap = new Map();
        results.forEach(res => {
            if (res && res.url) urlMap.set(res.vid, res.url);
        });

        // Add to batch
        for(const part of chunk) {
            if (part._docData) {
                if (urlMap.has(part.vendor_code)) {
                    part._docData.imageUrl = urlMap.get(part.vendor_code);
                } else if (!part._docData.imageUrl && part.image) {
                     // Keep existing text url if no blob upload happened
                     part._docData.imageUrl = part.image;
                }
                
                const ref = firestore.collection('products').doc(sanitizeId(part.vendor_code));
                batch.set(ref, part._docData);
                successCount++;
            }
        }

        await batch.commit();
        console.log(`Processed chunk ${i/chunkSize + 1}. Success: ${successCount} so far.`);
    }

    console.log(`Migration passed. Total success: ${successCount}, Errors: ${errorCount}`);
    db.close();
}

// --- Run ---
initFirebase().then(() => migrate()).catch(console.error);
