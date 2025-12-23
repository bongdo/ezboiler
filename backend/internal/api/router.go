package api

import (
	"encoding/json"
	"net/http"
	"net/url"
	"strconv"

	"ezboiler.ru/backend/internal/db"
	"ezboiler.ru/backend/internal/search"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
)

type Server struct {
	Router *chi.Mux
	Store  *db.Store
	TS     *search.Client
}

func NewServer(store *db.Store, ts *search.Client) *Server {
	r := chi.NewRouter()
	r.Use(middleware.Logger)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
	}))

	s := &Server{
		Router: r,
		Store:  store,
		TS:     ts,
	}

	r.Get("/api/products/*", s.handleGetPart)
	r.Get("/api/products", s.handleGetParts)
	r.Get("/api/filters", s.handleGetFilters)
	r.Get("/api/search", s.handleSearch)
	r.Get("/api/images/*", s.handleGetImage)

	return s
}

func (s *Server) handleGetPart(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "*")

	p, err := s.Store.GetPart(id)
	if err != nil {
		// Try decoding
		decoded, dErr := url.QueryUnescape(id)
		if dErr == nil && decoded != id {
			p, err = s.Store.GetPart(decoded)
		}
	}

	if err != nil {
		http.Error(w, "Part not found", http.StatusNotFound)
		return
	}
	json.NewEncoder(w).Encode(p)
}

func (s *Server) handleGetParts(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	typeIDStr := r.URL.Query().Get("type_id")
	boilerIDStr := r.URL.Query().Get("boiler_id")
	isUsedStr := r.URL.Query().Get("is_used")
	isOriginalStr := r.URL.Query().Get("is_original")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	filter := db.PartFilter{
		Query: q,
	}

	if typeIDStr != "" {
		if id, err := strconv.Atoi(typeIDStr); err == nil {
			filter.PartTypeID = &id
		}
	}
	if boilerIDStr != "" {
		if id, err := strconv.Atoi(boilerIDStr); err == nil {
			filter.BoilerID = &id
		}
	}
	if isUsedStr != "" {
		if val, err := strconv.ParseBool(isUsedStr); err == nil {
			filter.IsUsed = &val
		}
	}
	if isOriginalStr != "" {
		if val, err := strconv.ParseBool(isOriginalStr); err == nil {
			filter.IsOriginal = &val
		}
	}
	if limitStr != "" {
		if l, err := strconv.Atoi(limitStr); err == nil {
			filter.Limit = l
		}
	}
	if offsetStr != "" {
		if o, err := strconv.Atoi(offsetStr); err == nil {
			filter.Offset = o
		}
	}

	parts, err := s.Store.GetParts(filter)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(parts)
}

func (s *Server) handleGetFilters(w http.ResponseWriter, r *http.Request) {
	partTypes, err := s.Store.GetPartTypes()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	brands, err := s.Store.GetBrands()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	boilers, err := s.Store.GetBoilers()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	res := map[string]interface{}{
		"part_types": partTypes,
		"brands":     brands,
		"boilers":    boilers,
	}
	json.NewEncoder(w).Encode(res)
}

func (s *Server) handleSearch(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query().Get("q")
	res, err := s.TS.Search(q)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	json.NewEncoder(w).Encode(res)
}

func (s *Server) handleGetImage(w http.ResponseWriter, r *http.Request) {
	partCode := chi.URLParam(r, "*")
	// Try both raw and decoded to be sure
	data, err := s.Store.GetImage(partCode)
	if err != nil {
		// Try decoding only if direct lookup failed
		decoded, dErr := url.QueryUnescape(partCode)
		if dErr == nil && decoded != partCode {
			data, err = s.Store.GetImage(decoded)
		}
	}

	if err != nil {
		http.Error(w, "Image not found", http.StatusNotFound)
		return
	}
	w.Header().Set("Content-Type", "image/jpeg")
	w.Header().Set("Cache-Control", "public, max-age=86400")
	w.Write(data)
}
