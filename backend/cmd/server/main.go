package main

import (
	"log"
	"net/http"
	"os"

	"ezboiler.ru/backend/internal/api"
	"ezboiler.ru/backend/internal/db"
	"ezboiler.ru/backend/internal/importer"
	"ezboiler.ru/backend/internal/search"
	"ezboiler.ru/backend/internal/telegram"
)

func main() {
	// Configuration
	dbPath := os.Getenv("DB_PATH")
	if dbPath == "" {
		dbPath = "../ezboiler.db"
	}
	typesenseURL := os.Getenv("TYPESENSE_URL")
	if typesenseURL == "" {
		typesenseURL = "http://localhost:8108"
	}
	typesenseKey := os.Getenv("TYPESENSE_API_KEY")
	if typesenseKey == "" {
		typesenseKey = "xyz"
	}
	incomingDir := os.Getenv("INCOMING_DIR")
	if incomingDir == "" {
		incomingDir = "./incoming"
	}
	telegramToken := os.Getenv("TELEGRAM_TOKEN")
	webhookURL := os.Getenv("TELEGRAM_WEBHOOK_URL")

	// Initialize DB
	store, err := db.NewStore(dbPath)
	if err != nil {
		log.Fatal("Failed to init DB:", err)
	}

	// Initialize Typesense
	ts := search.NewClient(typesenseKey, typesenseURL)
	if err := ts.InitSchema(); err != nil {
		log.Println("Warning: Failed to init Typesense schema:", err)
	}

	// Start Import Watcher
	watcher := importer.NewWatcher(incomingDir, store, ts)
	go watcher.Start()

	// Start Telegram Bot
	if telegramToken != "" {
		bot, err := telegram.NewBot(telegramToken, webhookURL, store, ts)
		if err != nil {
			log.Println("Failed to start Telegram bot:", err)
		} else {
			bot.Start()
		}
	}

	// Start API Server
	srv := api.NewServer(store, ts)
	log.Println("Starting server on :8080")
	if err := http.ListenAndServe(":8080", srv.Router); err != nil {
		log.Fatal(err)
	}
}
