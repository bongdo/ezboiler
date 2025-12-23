# EzBoiler.ru Migration Project

This project contains the complete source code for the new EzBoiler.ru stack.

## Directory Structure

- `backend/`: Go backend (API, DB, Search, Watcher, Telegram)
- `frontend/`: Next.js 15 App Router frontend
- `infra/`: Infrastructure configuration (Nginx, Systemd)
- `Makefile`: Build and deployment scripts

## Prerequisites

- Ubuntu 24.04 Server
- Go 1.23+
- Node.js 20+
- Typesense Server (Binary)
- Nginx

## Deployment Instructions

1. **Install Dependencies**:

   ```bash
   # Install Go, Node.js, Nginx
   # Download Typesense binary to /opt/ezboiler/typesense-server
   ```

2. **Setup Directories**:

   ```bash
   mkdir -p /opt/ezboiler/{incoming,typesense-data}
   mkdir -p /var/www/ezboiler
   ```

3. **Build and Deploy**:

   ```bash
   make build
   # Copy files to server (see Makefile for paths)
   ```

4. **Configure Systemd**:

   - Copy `infra/systemd/*.service` to `/etc/systemd/system/`
   - Reload daemon: `systemctl daemon-reload`
   - Enable and start services: `systemctl enable --now typesense ezboiler ezboiler-frontend`

5. **Configure Nginx**:
   - Copy `infra/nginx.conf` to `/etc/nginx/sites-available/ezboiler.ru`
   - Link to sites-enabled
   - Test and reload Nginx

## Data Import

The system expects a daily JSON dump in `/opt/ezboiler/incoming/`.
Format:

```json
{
  "categories": [
    { "id": "1", "name": "Boilers", "slug": "boilers", "parent_id": "" }
  ],
  "products": [
    {
      "id": "101",
      "name": "Boiler X",
      "slug": "boiler-x",
      "description": "...",
      "price": 50000,
      "category_id": "1",
      "vendor": "BrandA",
      "images": ["url1", "url2"],
      "attributes": { "power": "24kW" },
      "stock": { "msk": 5 }
    }
  ]
}
```

To migrate from WordPress:

1. Use a WP Export plugin or custom script to generate this JSON structure.
2. Upload the file to `/opt/ezboiler/incoming/init.json`.
3. The watcher will automatically pick it up and populate SQLite and Typesense.
