#!/bin/bash
set -e

echo "Building Backend..."
# Build Go binary for Linux
cd backend
GOOS=linux GOARCH=amd64 go build -o ../deploy_bundle/backend_server ./cmd/server/main.go
cd ..

echo "Building Frontend..."
cd frontend
# Ensure we are building for production
npm run build
cd ..

echo "Copying Frontend artifacts..."
# Remove old frontend bundle if exists
rm -rf deploy_bundle/frontend
mkdir -p deploy_bundle/frontend

# Copy standalone build
# Note: Next.js standalone output preserves project structure. 
# Depending on where package.json is, it might be in .next/standalone/frontend or just .next/standalone.
# We will copy contents of .next/standalone to deploy_bundle/frontend.

if [ -d "frontend/.next/standalone" ]; then
    # Copy all files including hidden ones (like .next)
    cp -r frontend/.next/standalone/. deploy_bundle/frontend/
else
    echo "Error: .next/standalone not found. Did the build succeed?"
    exit 1
fi

# Copy public folder
if [ -d "frontend/public" ]; then
    cp -r frontend/public deploy_bundle/frontend/
fi
n Copy .next/static folder (required for standalone)
mkdir -p deploy_bundle/frontend/.next
if [ -d "frontend/.next/static" ]; then
    cp -r frontend/.next/static deploy_bundle/frontend/.next/
fi

# Copy BUILD_ID which is required for standalone mode to verify build
if [ -f "frontend/.next/BUILD_ID" ]; then
    cp frontend/.next/BUILD_ID deploy_bundle/frontend/.next/
fi

echo "Copying Database..."
cp ezboiler.db deploy_bundle/

echo "Done! Artifacts are in deploy_bundle/"
