# EZBoiler Database Migration

This directory contains the tools and results of converting the 1C-Bitrix XML export into a clean SQLite database.

## Files

- `ezboiler.db`: The SQLite database containing the cleaned data.
- `convert_xml_to_sqlite.py`: The Python script used to perform the conversion.
- `1cbitrix/`: Directory containing the source XML files (`import.xml`, `offers.xml`).

## Database Structure

The database `ezboiler.db` contains the following tables:

### Common Tables

- **`brands`**: List of boiler brands.
- **`boilers`**: Specific boiler models linked to brands.
- **`part_types`**: Types of spare parts (e.g., "Насосы циркуляционные").

### Parts Table

All parts are stored in a single table:

- **`parts`**
  - `vendor_code`: Text (Primary Key) - The article number/SKU.
  - `name`: Text - The name of the part.
  - `description`: Text - Description of the part.
  - `price`: Real - Price extracted from offers.
  - `quantity`: Integer - Stock quantity.
  - `image`: Text - Path to the image file.
  - `part_type_id`: Foreign Key to `part_types`.
  - `is_used`: Integer (0 or 1) - 1 if the part is used/refurbished, 0 otherwise.
  - `original_brand_id`: Foreign Key to `brands` - If the part is an original spare part, this links to the manufacturer brand. NULL for analog parts.

### Relationship Table

- **`parts_boilers`**
  - `part_code`: Foreign Key to `parts(vendor_code)`
  - `boiler_id`: Foreign Key to `boilers(id)`
  - `PRIMARY KEY (part_code, boiler_id)`

## Usage

To regenerate the database (e.g., if XML files change), run:

```bash
python3 convert_xml_to_sqlite.py
```

The script performs the following:

1.  Parses `import.xml` and `offers.xml`.
2.  Filters out excluded categories.
3.  Populates the `parts` table.
    - Sets `is_used=1` if the part is in a "Used" category or has a "W" suffix.
    - Sets `original_brand_id` if the part is in an "Original" category and matches a known brand.
4.  Matches parts to boiler models using fuzzy matching.
