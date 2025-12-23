package search

import (
	"context"
	"log"

	"ezboiler.ru/backend/internal/models"
	"github.com/typesense/typesense-go/typesense"
	"github.com/typesense/typesense-go/typesense/api"
)

type Client struct {
	client *typesense.Client
}

func NewClient(apiKey, url string) *Client {
	client := typesense.NewClient(
		typesense.WithServer(url),
		typesense.WithAPIKey(apiKey),
	)
	return &Client{client: client}
}

func (c *Client) InitSchema() error {
	schema := &api.CollectionSchema{
		Name: "parts",
		Fields: []api.Field{
			{Name: "vendor_code", Type: "string"},
			{Name: "name", Type: "string"},
			{Name: "description", Type: "string"},
			{Name: "price", Type: "float"},
			{Name: "part_type_id", Type: "int32", Facet: &[]bool{true}[0]},
			{Name: "part_type", Type: "string", Facet: &[]bool{true}[0]},
			{Name: "is_used", Type: "bool", Facet: &[]bool{true}[0]},
			{Name: "original_brand", Type: "string", Facet: &[]bool{true}[0]},
			{Name: "compatible_boilers", Type: "string[]", Facet: &[]bool{true}[0]},
		},
		DefaultSortingField: &[]string{"price"}[0],
	}

	_, err := c.client.Collections().Create(context.Background(), schema)
	if err != nil {
		log.Printf("Collection creation info: %v", err)
	}
	return nil
}

func (c *Client) IndexParts(parts []models.Part) error {
	documents := make([]interface{}, len(parts))
	for i, p := range parts {
		doc := map[string]interface{}{
			"vendor_code":        p.VendorCode,
			"name":               p.Name,
			"description":        p.Description,
			"price":              p.Price,
			"part_type_id":       p.PartTypeID,
			"part_type":          p.PartType,
			"is_used":            p.IsUsed,
			"original_brand":     p.OriginalBrand,
			"compatible_boilers": p.CompatibleBoilers,
		}
		documents[i] = doc
	}

	params := &api.ImportDocumentsParams{
		Action: &[]string{"upsert"}[0],
	}

	_, err := c.client.Collection("parts").Documents().Import(context.Background(), documents, params)
	return err
}

func (c *Client) Search(query string) (*api.SearchResult, error) {
	searchParams := &api.SearchCollectionParams{
		Q:       query,
		QueryBy: "name,description,vendor_code,compatible_boilers",
	}
	return c.client.Collection("parts").Documents().Search(context.Background(), searchParams)
}
