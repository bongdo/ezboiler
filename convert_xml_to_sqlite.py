import xml.etree.ElementTree as ET
import sqlite3
import os
import re
import json

# Configuration
IMPORT_XML = '/home/bongdo/Documents/ezboiler.ru/ezboiler/1cbitrix/import.xml'
OFFERS_XML = '/home/bongdo/Documents/ezboiler.ru/ezboiler/1cbitrix/offers.xml'
DB_FILE = 'ezboiler.db'

# User provided data
KNOWN_BRANDS = {
    "BAXI": [
        "BAXI ECO Four", "BAXI MAIN FOUR", "BAXI LUNA-3", "BAXI LUNA-3 COMFORT",
        "BAXI MAIN", "BAXI ECO Classic", "BAXI ECO Compact", "BAXI ECO Home",
        "BAXI ECO Nova", "BAXI ECO-4s", "BAXI ECO-5 Compact", "BAXI FOURTECH",
        "BAXI MAIN DIGIT", "BAXI MAIN-5", "BAXI SLIM"
    ],
    "NAVIEN": [
        "NAVIEN ACE", "NAVIEN DELUXE", "NAVIEN C", "NAVIEN E", "NAVIEN S", "NAVIEN ONE"
    ],
    "ZONT": ["ZONT"],
    "VAILLANT": [
        "VAILLANT atmoMAX plus", "VAILLANT turboMAX plus", "VAILLANT atmoMAX pro",
        "VAILLANT turboMAX pro", "VAILLANT atmoTEC plus", "VAILLANT turboTEC plus",
        "VAILLANT atmoTEC pro", "VAILLANT turboTEC pro", "VAILLANT turboFIT"
    ],
    "PROTHERM": [
        "PROTHERM LYNX HK", "PROTHERM ГЕПАРД", "PROTHERM ПАНТЕРА", "PROTHERM ЯГУАР JTV",
        "PROTHERM ЛЕОПАРД", "PROTHERM РЫСЬ", "PROTHERM МЕДВЕДЬ KLO", "PROTHERM МЕДВЕДЬ KLOM",
        "PROTHERM МЕДВЕДЬ KLZ", "PROTHERM МЕДВЕДЬ PLO", "PROTHERM МЕДВЕДЬ TLO", "PROTHERM СКАТ"
    ],
    "VIESSMANN": [
        "VIESSMANN VITOPEND 100-W"
    ],
    "BUDERUS": [
        "BUDERUS LOGAMAX U072", "BUDERUS LOGAMAX U012", "BUDERUS LOGAMAX U014",
        "BUDERUS LOGAMAX U022", "BUDERUS LOGAMAX U024", "BUDERUS LOGAMAX U032",
        "BUDERUS LOGAMAX U034", "BUDERUS LOGAMAX U042", "BUDERUS LOGAMAX U044",
        "BUDERUS LOGAMAX U052", "BUDERUS LOGAMAX U054"
    ],
    "CELTIC": ["CELTIC-DS PLATINUM"],
    "ARDERIA": ["ARDERIA ESR", "ARDERIA серия B", "ARDERIA серия D"],
    "DAESUNG": ["DAESUNG"],
    "IMMERGAS": ["IMMERGAS NIKE MYTHOS", "IMMERGAS MAJOR", "IMMERGAS MINI", "IMMERGAS STAR"],
    "JUNKERS": ["JUNKERS BOSCH EUROLINE"],
    "KITURAMI": [
        "KITURAMI Twin Alpha", "KITURAMI World 3000", "KITURAMI World 5000",
        "KITURAMI KSG", "KITURAMI STSG", "KITURAMI TGB 30", "KITURAMI World Plus"
    ],
    "KOREASTAR": [
        "KOREASTAR PREMIUM E", "KOREASTAR ACE", "KOREASTAR BRAVO E", "KOREASTAR BRAVO K",
        "KOREASTAR BURAN", "KOREASTAR PREMIUM A", "KOREASTAR PREMIUM ES",
        "KOREASTAR PRESIDENT", "KOREASTAR SENATOR D", "KOREASTAR SENATOR T", "KOREASTAR SENATOR TP"
    ],
    "MASTER": ["MASTER GAS SEOUL"]
}

KNOWN_PART_TYPES = [
    "ZONT", "Насосы циркуляционные", "Первичные теплообменники",
    "Пластинчатые теплообменники для ГВС", "Вентиляторы", "Клапаны трехходового",
    "Расширительные баки", "Сервоприводы трехходового", "Датчики протока и расходомеры",
    "Датчики температуры", "Прессостаты", "Краны подпитки", "Реле и датчики давления",
    "Газовые клапаны", "Сбросные клапаны", "Манометры", "Уплотнители и прокладки", "Прочее"
]

EXCLUDED_GROUPS = ["Услуги", "Удаленные", "Материалы"]

def clean_text(text):
    if not text:
        return ""
    return text.strip()

def setup_database():
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Common tables
    cursor.execute('''
    CREATE TABLE brands (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE boilers (
        id INTEGER PRIMARY KEY,
        brand_id INTEGER REFERENCES brands(id),
        name TEXT,
        UNIQUE(brand_id, name)
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE part_types (
        id INTEGER PRIMARY KEY,
        name TEXT UNIQUE
    )
    ''')
    
    # Single Parts Table
    cursor.execute('''
    CREATE TABLE parts (
        vendor_code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL,
        quantity INTEGER DEFAULT 0,
        image TEXT,
        part_type_id INTEGER REFERENCES part_types(id),
        is_used INTEGER DEFAULT 0,
        original_brand_id INTEGER REFERENCES brands(id),
        in_price_list INTEGER DEFAULT 1
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE parts_boilers (
        part_code TEXT REFERENCES parts(vendor_code),
        boiler_id INTEGER REFERENCES boilers(id),
        PRIMARY KEY (part_code, boiler_id)
    )
    ''')
    
    # Pre-populate brands and boilers
    for brand, models in KNOWN_BRANDS.items():
        cursor.execute('INSERT OR IGNORE INTO brands (name) VALUES (?)', (brand,))
        brand_id = cursor.execute('SELECT id FROM brands WHERE name = ?', (brand,)).fetchone()[0]
        
        for model in models:
            cursor.execute('INSERT OR IGNORE INTO boilers (brand_id, name) VALUES (?, ?)', (brand_id, model))
            
    # Pre-populate part types
    for pt in KNOWN_PART_TYPES:
        cursor.execute('INSERT OR IGNORE INTO part_types (name) VALUES (?)', (pt,))
        
    cursor.execute('''
    CREATE TABLE product_images (
        id INTEGER PRIMARY KEY,
        part_code TEXT REFERENCES parts(vendor_code),
        image_data BLOB,
        UNIQUE(part_code)
    )
    ''')
    
    conn.commit()
    return conn

def parse_import_xml(conn):
    tree = ET.parse(IMPORT_XML)
    root = tree.getroot()
    
    # 1. Parse Groups (Categories)
    groups = {} # ID -> Name
    group_parents = {} # ID -> ParentID (to trace hierarchy if needed)
    
    def traverse_groups(group_element, parent_id=None):
        g_id = group_element.find('Ид').text
        g_name = group_element.find('Наименование').text
        groups[g_id] = g_name
        if parent_id:
            group_parents[g_id] = parent_id
        
        subgroups = group_element.find('Группы')
        if subgroups is not None:
            for sg in subgroups.findall('Группа'):
                traverse_groups(sg, g_id)

    classifier = root.find('Классификатор')
    if classifier is not None:
        groups_root = classifier.find('Группы')
        if groups_root is not None:
            for g in groups_root.findall('Группа'):
                traverse_groups(g)
                
    # 2. Parse Products
    catalog = root.find('Каталог')
    products = {}
    if catalog is not None:
        goods = catalog.find('Товары')
        if goods is not None:
            for product in goods.findall('Товар'):
                p_id = product.find('Ид').text
                p_code = product.find('Артикул')
                p_code = p_code.text if p_code is not None else "NO_CODE_" + p_id
                
                # Get Name - Fix for "Вес" bug
                p_name_tag = product.find('Наименование').text
                p_name = p_name_tag
                
                p_desc = product.find('Описание')
                p_desc = p_desc.text if p_desc is not None else ""
                
                p_image = product.find('Картинка')
                p_image = p_image.text if p_image is not None else ""
                
                # Find group
                p_group_id = None
                groups_tag = product.find('Группы')
                if groups_tag is not None:
                    gid_tag = groups_tag.find('Ид')
                    if gid_tag is not None:
                        p_group_id = gid_tag.text

                # Check properties for "Полное наименование"
                props_tag = product.find('ЗначенияРеквизитов')
                if props_tag is not None:
                    for prop in props_tag.findall('ЗначениеРеквизита'):
                        prop_name = prop.find('Наименование').text
                        prop_val = prop.find('Значение').text
                        if prop_name == "Полное наименование" and prop_val:
                            p_name = prop_val
                            
                products[p_id] = {
                    'code': p_code,
                    'name': p_name,
                    'description': p_desc,
                    'image': p_image,
                    'group_id': p_group_id
                }
    
    return groups, products, group_parents

def parse_offers_xml(products):
    tree = ET.parse(OFFERS_XML)
    root = tree.getroot()
    
    offers_pkg = root.find('ПакетПредложений')
    if offers_pkg is not None:
        offers = offers_pkg.find('Предложения')
        if offers is not None:
            for offer in offers.findall('Предложение'):
                o_id = offer.find('Ид').text
                if '#' in o_id:
                    o_id = o_id.split('#')[0]
                
                if o_id in products:
                    prices = offer.find('Цены')
                    price_val = 0.0
                    if prices is not None:
                        price = prices.find('Цена')
                        if price is not None:
                            p_unit = price.find('ЦенаЗаЕдиницу')
                            if p_unit is not None:
                                price_val = float(p_unit.text)
                    
                    qty_tag = offer.find('Количество')
                    qty = 0
                    if qty_tag is not None:
                        try:
                            qty = float(qty_tag.text)
                            qty = int(qty)
                        except:
                            qty = 0
                            
                    products[o_id]['price'] = price_val
                    products[o_id]['quantity'] = qty

def match_part_type(group_name, known_types):
    if not group_name:
        return "Прочее"
    clean_name = re.sub(r'^[a-zа-я0-9]+\.\s*', '', group_name, flags=re.IGNORECASE).strip()
    if clean_name in known_types:
        return clean_name
    for kt in known_types:
        if kt.lower() in clean_name.lower():
            return kt
    return "Прочее"

def generate_search_terms(brand, model_name):
    terms = set()
    terms.add(model_name.lower())
    if '/' in model_name:
        parts = model_name.split('/')
        for part in parts:
            p = part.strip()
            terms.add(p.lower())
            if brand.lower() not in p.lower():
                terms.add(f"{brand} {p}".lower())
    if model_name.lower().startswith(brand.lower() + " "):
        stripped = model_name[len(brand)+1:].strip()
        terms.add(stripped.lower())
    return terms

def find_compatible_boilers(text, cursor):
    compatible_ids = set()
    text_lower = text.lower()
    cursor.execute('SELECT id, name, brand_id FROM boilers')
    all_boilers = cursor.fetchall()
    cursor.execute('SELECT id, name FROM brands')
    brands_map = {row[0]: row[1] for row in cursor.fetchall()}
    
    for b_id, b_name, brand_id in all_boilers:
        brand_name = brands_map.get(brand_id)
        search_terms = generate_search_terms(brand_name, b_name)
        for term in search_terms:
            if len(term) < 3: continue
            escaped_term = re.escape(term)
            pattern = r'(^|\W)' + escaped_term + r'(\W|$)'
            if re.search(pattern, text_lower):
                compatible_ids.add(b_id)
                break
    return list(compatible_ids)

def is_excluded(group_name):
    if not group_name:
        return False
    for ex in EXCLUDED_GROUPS:
        if ex.lower() in group_name.lower():
            return True
    return False

def main():
    conn = setup_database()
    cursor = conn.cursor()
    
    print("Parsing import.xml...")
    groups, products, group_parents = parse_import_xml(conn)
    print(f"Found {len(groups)} groups and {len(products)} products.")
    
    print("Parsing offers.xml...")
    parse_offers_xml(products)
    
    print("Processing and inserting data...")
    count = 0
    
    # Cache brand IDs
    cursor.execute('SELECT name, id FROM brands')
    brand_ids = {row[0].lower(): row[1] for row in cursor.fetchall()}
    
    base_dir = os.path.dirname(IMPORT_XML)

    for p_id, p_data in products.items():
        group_name = groups.get(p_data['group_id'], "")
        
        # 1. Filter Excluded
        if is_excluded(group_name):
            continue
            
        # 2. Determine Part Type
        part_type_name = match_part_type(group_name, KNOWN_PART_TYPES)
        part_type_id = None
        if part_type_name:
            res = cursor.execute('SELECT id FROM part_types WHERE name = ?', (part_type_name,)).fetchone()
            if res:
                part_type_id = res[0]
            else:
                cursor.execute('INSERT OR IGNORE INTO part_types (name) VALUES (?)', (part_type_name,))
                part_type_id = cursor.execute('SELECT id FROM part_types WHERE name = ?', (part_type_name,)).fetchone()[0]
        
        # Helper to check group hierarchy
        def get_hierarchy_path(gid):
            path = []
            curr = gid
            while curr:
                name = groups.get(curr, "")
                path.append(name)
                curr = group_parents.get(curr)
            return path

        hierarchy = get_hierarchy_path(p_data['group_id'])
        hierarchy_str = " ".join(hierarchy).lower()
        
        # 3. Determine is_used
        is_used = 0
        if "б.у." in hierarchy_str:
            is_used = 1
        elif re.search(r'w($|\s|_)', p_data['code'], re.IGNORECASE):
            is_used = 1
            
        # 4. Determine original_brand_id
        original_brand_id = None
        if "оригинальные" in hierarchy_str:
            # Try to find brand in hierarchy
            for h_name in hierarchy:
                for brand_name, b_id in brand_ids.items():
                    if brand_name in h_name.lower():
                        original_brand_id = b_id
                        break
                if original_brand_id:
                    break

        # 5. Determine in_price_list
        # User said "not incl in price" should have 0.
        # I'll check for "не включено в прайс" or "не вкл в прайс" in hierarchy.
        in_price_list = 1
        if "не вкл" in hierarchy_str and "прайс" in hierarchy_str:
             in_price_list = 0
        
        # 6. Insert
        try:
            cursor.execute('''
            INSERT OR REPLACE INTO parts (vendor_code, name, description, price, quantity, image, part_type_id, is_used, original_brand_id, in_price_list)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                p_data['code'],
                p_data['name'],
                p_data['description'],
                p_data.get('price', 0.0),
                p_data.get('quantity', 0),
                p_data['image'],
                part_type_id,
                is_used,
                original_brand_id,
                in_price_list
            ))
            
            # Insert Image Blob
            if p_data['image']:
                image_path = os.path.join(base_dir, p_data['image'])
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        img_data = f.read()
                        cursor.execute('INSERT OR REPLACE INTO product_images (part_code, image_data) VALUES (?, ?)', (p_data['code'], img_data))
            
            # 7. Link Boilers
            full_text = f"{p_data['name']} {p_data['description']}"
            boiler_ids = find_compatible_boilers(full_text, cursor)
            
            for b_id in boiler_ids:
                cursor.execute('INSERT OR IGNORE INTO parts_boilers (part_code, boiler_id) VALUES (?, ?)', (p_data['code'], b_id))
                
            count += 1
            if count % 1000 == 0:
                print(f"Processed {count} items...")
                
        except sqlite3.Error as e:
            print(f"Error inserting {p_data['code']}: {e}")
            
    conn.commit()
    conn.close()
    print(f"Done! Processed {count} valid items.")

if __name__ == "__main__":
    main()
