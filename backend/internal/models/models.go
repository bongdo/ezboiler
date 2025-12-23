package models

type Part struct {
	VendorCode      string  `json:"vendor_code"`
	Name            string  `json:"name"`
	Description     string  `json:"description"`
	Price           float64 `json:"price"`
	Quantity        int     `json:"quantity"`
	Image           string  `json:"image"`
	PartTypeID      int     `json:"part_type_id"`
	IsUsed          bool    `json:"is_used"`
	OriginalBrandID *int    `json:"original_brand_id,omitempty"`

	// Joined fields
	PartType          string   `json:"part_type,omitempty"`
	OriginalBrand     string   `json:"original_brand,omitempty"`
	InPriceList       int      `json:"in_price_list"`
	CompatibleBoilers []string `json:"compatible_boilers,omitempty"` // List of boiler names
}

type Brand struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type Boiler struct {
	ID      int    `json:"id"`
	BrandID int    `json:"brand_id"`
	Name    string `json:"name"`
}

type PartType struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

type SearchResult struct {
	Parts []Part `json:"parts"`
	Total int    `json:"total"`
}
