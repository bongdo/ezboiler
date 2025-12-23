package importer

import (
	"log"

	"ezboiler.ru/backend/internal/db"
	"ezboiler.ru/backend/internal/search"
	"github.com/fsnotify/fsnotify"
)

type Watcher struct {
	watchDir string
	store    *db.Store
	ts       *search.Client
}

func NewWatcher(dir string, store *db.Store, ts *search.Client) *Watcher {
	return &Watcher{
		watchDir: dir,
		store:    store,
		ts:       ts,
	}
}

func (w *Watcher) Start() {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				if event.Op&fsnotify.Create == fsnotify.Create || event.Op&fsnotify.Write == fsnotify.Write {
					log.Println("New file detected:", event.Name)
					w.processFile(event.Name)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("error:", err)
			}
		}
	}()

	err = watcher.Add(w.watchDir)
	if err != nil {
		log.Fatal(err)
	}
	<-done
}

func (w *Watcher) processFile(path string) {
	// Watcher logic disabled as data ingestion is now handled by Python script directly to SQLite
	log.Println("Watcher disabled. Ignoring file:", path)
}
