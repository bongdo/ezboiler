import sqlite3

DB_FILE = 'ezboiler.db'

def check_no_products():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Find products with _н/о in vendor_code
    cursor.execute("SELECT part_code, length(image_data) FROM product_images WHERE part_code LIKE '%_н/о%' LIMIT 5")
    rows = cursor.fetchall()
    
    if not rows:
        print("No images found for products with '_н/о' in vendor_code in product_images table.")
        # Check if such parts exist in parts table
        cursor.execute("SELECT vendor_code FROM parts WHERE vendor_code LIKE '%_н/о%' LIMIT 5")
        parts = cursor.fetchall()
        print(f"Parts matching '%_н/о%': {parts}")
    else:
        for row in rows:
            print(f"Found image: Code '{row[0]}', Size {row[1]} bytes")

    conn.close()

if __name__ == "__main__":
    check_no_products()
