.PHONY: build deploy

build:
	@echo "Building Go backend..."
	mkdir -p dist
	cd backend && go mod tidy && go build -o ../dist/go-server ./cmd/server
	@echo "Building Next.js frontend..."
	cd frontend && npm install && npm run build
	@echo "Copying frontend build..."
	mkdir -p dist/frontend
	cp -r frontend/.next dist/frontend/
	cp -r frontend/public dist/frontend/
	cp frontend/package.json dist/frontend/
	cp frontend/next.config.ts dist/frontend/

deploy:
	@echo "Deploying to server..."
	# This assumes you have SSH access configured
	# scp -r dist/go-server user@server:/opt/ezboiler/
	# scp -r dist/frontend/* user@server:/var/www/ezboiler/
	# ssh user@server "systemctl restart ezboiler ezboiler-frontend"
