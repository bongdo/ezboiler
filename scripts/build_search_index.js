const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const vm = require('vm');

const IMPORT_FILE = path.join(__dirname, '../1cbitrix/1cbitrix/import.xml');
const OFFERS_FILE = path.join(__dirname, '../1cbitrix/1cbitrix/offers.xml');
const OUTPUT_FILE = path.join(__dirname, '../search_index.json');

const synonyms = {
    "насос": ["pump", "циркуляционный"],
    "вентилятор": ["fan", "вентиляторы"],
    "клапан": ["valve", "вентиль"],
    "плата": ["board", "pcb", "электронная"],
    "датчик": ["sensor", "ntc"],
    "теплообменник": ["heat exchanger", "he"],
    "бак": ["tank", "expansion"],
    "прессостат": ["pressure switch", "реле давления воздуха"],
    "кран": ["valve", "tap", "подпитки"],
    "горелка": ["burner"],
    "термостат": ["thermostat"],
    "манометр": ["manometer", "pressure gauge"],
    "электрод": ["electrode"],
    "мотор": ["motor", "двигатель"],
    "прокладка": ["gasket", "seal"],
    "уплотнитель": ["seal", "gasket"],
    "мембрана": ["membrane", "diaphragm"],
    "аквасенсор": ["aquasensor", "flow switch"],
    "картридж": ["cartridge"],
    "сервопривод": ["actuator", "motor"]
};

// Flatten synonyms for reverse lookup if needed, but here simple expansion of search terms or indexing is better.
// We will add synonyms into the "keywords" field of each product based on its name/category.

function getSynonyms(text) {
    let words = text.toLowerCase().split(/\s+/);
    let syns = [];
    words.forEach(w => {
        for (const [key, values] of Object.entries(synonyms)) {
            if (w.includes(key)) {
                syns.push(...values);
            }
        }
    });
    return [...new Set(syns)].join(' ');
}

async function parseXml(filePath) {
    const parser = new xml2js.Parser({ explicitArray: false });
    const data = await fs.promises.readFile(filePath);
    return parser.parseStringPromise(data);
}

async function buildIndex() {
    console.log('Reading XML files...');
    const importData = await parseXml(IMPORT_FILE);
    const offersData = await parseXml(OFFERS_FILE);

    console.log('Processing Categories...');
    const classifier = importData['КоммерческаяИнформация']['Классификатор'];
    const groupsRaw = classifier['Группы']['Группа'];
    
    // Recursive function to flatten groups
    const groupsMap = new Map(); // ID -> Name
    const groupParents = new Map(); // ID -> ParentID

    function processGroup(group, parentId = null) {
        const id = group['Ид'];
        const name = group['Наименование'];
        groupsMap.set(id, name);
        if (parentId) groupParents.set(id, parentId);

        if (group['Группы'] && group['Группы']['Группа']) {
            const children = Array.isArray(group['Группы']['Группа']) ? group['Группы']['Группа'] : [group['Группы']['Группа']];
            children.forEach(child => processGroup(child, id));
        }
    }

    // groupsRaw can be array or object
    const rootGroups = Array.isArray(groupsRaw) ? groupsRaw : [groupsRaw];
    rootGroups.forEach(g => processGroup(g));

    console.log(`Found ${groupsMap.size} categories.`);

    console.log('Processing Products...');
    const catalog = importData['КоммерческаяИнформация']['Каталог'];
    const productsRaw = catalog['Товары']['Товар'];
    const productsList = Array.isArray(productsRaw) ? productsRaw : [productsRaw];

    // Load DATA from data.js
    const dataJsPath = path.join(__dirname, '../data.js');
    const dataJsContent = await fs.promises.readFile(dataJsPath, 'utf8');
    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInNewContext(dataJsContent, sandbox);
    const APP_DATA = sandbox.DATA;

    const products = [];

    // Add Brands, Models, Types to index
    if (APP_DATA.brands) {
        APP_DATA.brands.forEach(b => {
             // Brand
             products.push({
                 id: 'brand_' + b.name,
                 name: b.name,
                 type: 'brand',
                 keywords: b.name.toLowerCase(),
                 imageUrl: '', // Will be handled by frontend icon
                 price: null
             });
             
             // Models
             if (b.models) {
                 b.models.forEach(m => {
                     products.push({
                         id: 'model_' + m,
                         name: m,
                         type: 'model',
                         brandName: b.name,
                         keywords: m.toLowerCase() + ' ' + b.name.toLowerCase(),
                         imageUrl: '',
                         price: null
                     });
                 });
             }
        });
    }

    if (APP_DATA.partTypes) {
        APP_DATA.partTypes.forEach(t => {
            products.push({
                id: 'type_' + t,
                name: t,
                type: 'type',
                keywords: t.toLowerCase(),
                imageUrl: '',
                price: null
            });
        });
    }

    productsList.forEach(p => {
        const id = p['Ид'];
        const name = p['Наименование'];
        const article = p['Артикул'] || '';
        const groupIds = p['Группы'] ? (Array.isArray(p['Группы']['Ид']) ? p['Группы']['Ид'] : [p['Группы']['Ид']]) : [];
        
        // Build category names list
        const categoryNames = groupIds.map(gid => {
            let names = [];
            let curr = gid;
            while(curr) {
                if(groupsMap.has(curr)) {
                    names.unshift(groupsMap.get(curr));
                    curr = groupParents.get(curr);
                } else {
                    break;
                }
            }
            return names.join(' > ');
        }).filter(Boolean);

        // Keywords: Name + Article + Categories + Synonyms
        const categoryText = categoryNames.join(' ');
        const syns = getSynonyms(name + ' ' + categoryText);
        const keywords = `${name} ${article} ${categoryText} ${syns}`.toLowerCase();
        
        let imageUrl = '';
        if (p['Картинка']) {
             // p['Картинка'] is relative from the XML file location, e.g. import_files/...
             // index.html is in root
             // XML is in 1cbitrix/1cbitrix/
             // So path should be 1cbitrix/1cbitrix/ + path
             imageUrl = '1cbitrix/1cbitrix/' + p['Картинка'];
        }

        products.push({
            id: id,
            name: name,
            vendorCode: article,
            category: categoryNames, // Array of strings (paths)
            keywords: keywords,
            description: p['Описание'] || '',
            imageUrl: imageUrl, 
            price: 0 // Will be updated from offers
        });
    });

    console.log(`Processed ${products.length} products.`);

    console.log('Processing Offers/Prices...');
    const offersPackage = offersData['КоммерческаяИнформация']['ПакетПредложений'];
    const offersRaw = offersPackage['Предложения']['Предложение'];
    const offersList = Array.isArray(offersRaw) ? offersRaw : [offersRaw];
    
    let matchedCount = 0;
    
    // Map offers by ID
    const offersMap = new Map();
    offersList.forEach(o => {
        // Offer ID might match Product ID or be composite
        // Based on previous grep, IDs match directly.
        // check if ID contains #
        let id = o['Ид'];
        if (id.includes('#')) id = id.split('#')[0];
        
        let price = 0;
        if (o['Цены'] && o['Цены']['Цена']) {
            const priceObj = Array.isArray(o['Цены']['Цена']) ? o['Цены']['Цена'][0] : o['Цены']['Цена'];
            price = parseFloat(priceObj['ЦенаЗаЕдиницу'] || 0);
        }
        
        // Also quantity
        const qty = parseFloat(o['Количество'] || 0);

        offersMap.set(id, { price, qty });
    });

    // Merge
    products.forEach(p => {
        if (offersMap.has(p.id)) {
            matchedCount++;
            const offer = offersMap.get(p.id);
            p.price = offer.price;
            p.quantity = offer.qty;
        }
    });

    console.log(`Matched prices for ${matchedCount} products.`);

    // Filter out products with no price or name if desired? user didn't specify. but usually yes.
    // For now, keep all.
    
    await fs.promises.writeFile(OUTPUT_FILE, JSON.stringify(products, null, 2));
    console.log(`Search index written to ${OUTPUT_FILE}`);
}

buildIndex().catch(console.error);
