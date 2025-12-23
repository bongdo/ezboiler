package telegram

import (
	"ezboiler.ru/backend/internal/db"
	"ezboiler.ru/backend/internal/search"
	tele "gopkg.in/telebot.v3"
)

type Bot struct {
	b     *tele.Bot
	store *db.Store
	ts    *search.Client
}

func NewBot(token string, webhookURL string, store *db.Store, ts *search.Client) (*Bot, error) {
	pref := tele.Settings{
		Token: token,
		Poller: &tele.Webhook{
			Listen: ":8081", // Internal port for webhook
			Endpoint: &tele.WebhookEndpoint{
				PublicURL: webhookURL,
			},
		},
	}

	b, err := tele.NewBot(pref)
	if err != nil {
		return nil, err
	}

	bot := &Bot{
		b:     b,
		store: store,
		ts:    ts,
	}

	b.Handle("/start", func(c tele.Context) error {
		return c.Send("Welcome to EzBoiler Bot!")
	})

	b.Handle("/search", func(c tele.Context) error {
		query := c.Message().Payload
		if query == "" {
			return c.Send("Please provide a search query: /search <query>")
		}

		res, err := ts.Search(query)
		if err != nil {
			return c.Send("Error searching")
		}

		if *res.Found == 0 {
			return c.Send("No products found")
		}

		// Simple list of first 5 results
		msg := "Found products:\n"
		for i, hit := range *res.Hits {
			if i >= 5 {
				break
			}
			doc := hit.Document
			if doc == nil {
				continue
			}
			name, _ := (*doc)["name"].(string)
			price, _ := (*doc)["price"].(float64)
			msg += "- " + name + " (" + string(int(price)) + " rub)\n"
		}
		return c.Send(msg)
	})

	return bot, nil
}

func (bot *Bot) Start() {
	go bot.b.Start()
}
