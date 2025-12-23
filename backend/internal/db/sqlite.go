package db

import (
	"database/sql"
	"strings"

	"ezboiler.ru/backend/internal/models"
	_ "github.com/mattn/go-sqlite3"
)

type Store struct {
	db *sql.DB
}

func NewStore(dbPath string) (*Store, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Store{db: db}, nil
}

func (s *Store) GetPart(vendorCode string) (*models.Part, error) {
	query := `
		SELECT p.vendor_code, p.name, p.description, p.price, p.quantity, p.image, 
		       p.part_type_id, p.is_used, p.original_brand_id,
		       pt.name as part_type_name, b.name as brand_name
		FROM parts p
		LEFT JOIN part_types pt ON p.part_type_id = pt.id
		LEFT JOIN brands b ON p.original_brand_id = b.id
		WHERE p.vendor_code = ?
	`
	row := s.db.QueryRow(query, vendorCode)

	var p models.Part
	var partTypeName, brandName sql.NullString
	var originalBrandID sql.NullInt64

	err := row.Scan(
		&p.VendorCode, &p.Name, &p.Description, &p.Price, &p.Quantity, &p.Image,
		&p.PartTypeID, &p.IsUsed, &originalBrandID,
		&partTypeName, &brandName,
	)
	if err != nil {
		return nil, err
	}

	if partTypeName.Valid {
		p.PartType = partTypeName.String
	}
	if brandName.Valid {
		p.OriginalBrand = brandName.String
	}
	if originalBrandID.Valid {
		id := int(originalBrandID.Int64)
		p.OriginalBrandID = &id
	}

	// Fetch compatible boilers
	boilers, err := s.getCompatibleBoilers(p.VendorCode)
	if err == nil {
		p.CompatibleBoilers = boilers
	}

	return &p, nil
}

func (s *Store) getCompatibleBoilers(partCode string) ([]string, error) {
	query := `
		SELECT b.name 
		FROM parts_boilers pb
		JOIN boilers b ON pb.boiler_id = b.id
		WHERE pb.part_code = ?
	`
	rows, err := s.db.Query(query, partCode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var names []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			continue
		}
		names = append(names, name)
	}
	return names, nil
}

type PartFilter struct {
	Query      string
	PartTypeID *int
	BoilerID   *int
	IsUsed     *bool
	IsOriginal *bool
	Limit      int
	Offset     int
}

func (s *Store) GetParts(filter PartFilter) ([]models.Part, error) {
	query := `
		SELECT DISTINCT p.vendor_code, p.name, p.description, p.price, p.quantity, p.image, 
		       p.part_type_id, p.is_used, p.original_brand_id, p.in_price_list,
		       pt.name as part_type_name, b.name as brand_name
		FROM parts p
		LEFT JOIN part_types pt ON p.part_type_id = pt.id
		LEFT JOIN brands b ON p.original_brand_id = b.id
		LEFT JOIN parts_boilers pb ON p.vendor_code = pb.part_code
	`
	var args []interface{}
	var conditions []string

	if filter.Query != "" {
		conditions = append(conditions, "(p.name LIKE ? OR p.vendor_code LIKE ?)")
		args = append(args, "%"+filter.Query+"%", "%"+filter.Query+"%")
	}
	if filter.PartTypeID != nil {
		conditions = append(conditions, "p.part_type_id = ?")
		args = append(args, *filter.PartTypeID)
	}
	if filter.BoilerID != nil {
		conditions = append(conditions, "pb.boiler_id = ?")
		args = append(args, *filter.BoilerID)
	}
	if filter.IsUsed != nil {
		conditions = append(conditions, "p.is_used = ?")
		if *filter.IsUsed {
			args = append(args, 1)
		} else {
			args = append(args, 0)
		}
	}
	if filter.IsOriginal != nil {
		if *filter.IsOriginal {
			conditions = append(conditions, "p.original_brand_id IS NOT NULL")
		} else {
			conditions = append(conditions, "p.original_brand_id IS NULL")
		}
	}

	if len(conditions) > 0 {
		query += " WHERE " + strings.Join(conditions, " AND ")
	}

	query += " LIMIT ? OFFSET ?"
	limit := filter.Limit
	if limit == 0 {
		limit = 50
	}
	args = append(args, limit, filter.Offset)

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var parts []models.Part
	for rows.Next() {
		var p models.Part
		var partTypeName, brandName sql.NullString
		var originalBrandID sql.NullInt64

		if err := rows.Scan(
			&p.VendorCode, &p.Name, &p.Description, &p.Price, &p.Quantity, &p.Image,
			&p.PartTypeID, &p.IsUsed, &originalBrandID, &p.InPriceList,
			&partTypeName, &brandName,
		); err != nil {
			return nil, err
		}

		if partTypeName.Valid {
			p.PartType = partTypeName.String
		}
		if brandName.Valid {
			p.OriginalBrand = brandName.String
		}
		if originalBrandID.Valid {
			id := int(originalBrandID.Int64)
			p.OriginalBrandID = &id
		}
		parts = append(parts, p)
	}

	return parts, nil
}

func (s *Store) GetPartTypes() ([]models.PartType, error) {
	rows, err := s.db.Query("SELECT id, name FROM part_types ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var types []models.PartType
	for rows.Next() {
		var t models.PartType
		if err := rows.Scan(&t.ID, &t.Name); err != nil {
			return nil, err
		}
		types = append(types, t)
	}
	return types, nil
}

func (s *Store) GetBrands() ([]models.Brand, error) {
	rows, err := s.db.Query("SELECT id, name FROM brands ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var brands []models.Brand
	for rows.Next() {
		var b models.Brand
		if err := rows.Scan(&b.ID, &b.Name); err != nil {
			return nil, err
		}
		brands = append(brands, b)
	}
	return brands, nil
}

func (s *Store) GetBoilers() ([]models.Boiler, error) {
	rows, err := s.db.Query("SELECT id, brand_id, name FROM boilers ORDER BY name")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var boilers []models.Boiler
	for rows.Next() {
		var b models.Boiler
		if err := rows.Scan(&b.ID, &b.BrandID, &b.Name); err != nil {
			return nil, err
		}
		boilers = append(boilers, b)
	}
	return boilers, nil
}

func (s *Store) GetImage(partCode string) ([]byte, error) {
	var data []byte
	query := "SELECT image_data FROM product_images WHERE part_code = ?"
	err := s.db.QueryRow(query, partCode).Scan(&data)
	if err != nil {
		return nil, err
	}
	return data, nil
}
