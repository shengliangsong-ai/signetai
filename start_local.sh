#!/bin/bash

# Ensure we are in the project root
cd "$(dirname "$0")"

echo "Starting Signet Local Dev Environment..."

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Load .env file if it exists
if [ -f .env ]; then
  echo "Loading environment variables from .env..."
  export $(grep -v '^#' .env | xargs)
fi

# Check if API_KEY is provided
if [ -z "$API_KEY" ]; then
  echo "Warning: API_KEY environment variable is not set."
  echo "Usage: API_KEY=your_api_key ./start_local.sh"
  # Default to the key from private_keys.ts if not provided, but it's better to be explicit
fi

# Start the dev server
echo "Starting Vite dev server..."
npm run dev
