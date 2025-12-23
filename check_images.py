import sqlite3
import os

DB_FILE = 'ezboiler.db'

def check_images():
    if not os.path.exists(DB_FILE):
        print("DB not found")
        return

    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # Check count
    count = cursor.execute('SELECT count(*) FROM product_images').fetchone()[0]
    print(f"Total images in DB: {count}")
    
    # Check one
    if count > 0:
        row = cursor.execute('SELECT part_code, length(image_data) FROM product_images LIMIT 1').fetchone()
        print(f"Sample: Part {row[0]}, Size {row[1]} bytes")
        
    conn.close()

if __name__ == "__main__":
    check_images()
