#!/bin/bash

# Startup script for Hetzner server
# Run this to set up and start all apps

set -e

echo "=== Vibe Apps Startup Script ==="

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update
    sudo apt-get install -y ca-certificates curl gnupg lsb-release
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker $USER
fi

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install Vibekit if not installed
if ! command -v vibekit &> /dev/null; then
    echo "Installing Vibekit..."
    sudo npm install -g vibekit
fi

# Install bun if not installed
if ! command -v bun &> /dev/null; then
    echo "Installing Bun..."
    curl -fsSL https://bun.sh/install | bash
    export PATH="$HOME/.bun/bin:$PATH"
fi

# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get update
    sudo apt-get install -y nginx
fi

# Install dependencies for each app
echo "Installing dependencies..."
for app_dir in apps/*/; do
    if [ -f "$app_dir/server.ts" ]; then
        echo "Setting up $(basename $app_dir)..."
        cd "$app_dir"
        
        # Create package.json if it doesn't exist
        if [ ! -f "package.json" ]; then
            cat > package.json << 'EOF'
{
  "name": "app",
  "dependencies": {
    "hono": "latest"
  }
}
EOF
        fi
        
        # Install dependencies
        bun install
        cd - > /dev/null
    fi
done

echo "Setting up nginx..."

# Prepare static root for index page
sudo mkdir -p /var/www/vibe
sudo cp -f index.html /var/www/vibe/index.html

# Install nginx site config that serves static root and maps /1.. /100 -> :3001..:3100
sudo cp nginx/apps.conf /etc/nginx/sites-available/vibe-apps
sudo ln -sf /etc/nginx/sites-available/vibe-apps /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# Create log directory for future apps
sudo mkdir -p /var/log/sloppy
sudo chown $USER:$USER /var/log/sloppy

echo ""
echo "=== Vibe Development Environment Ready! ==="
echo ""
echo "Docker version: $(docker --version 2>/dev/null || echo 'not installed')"
echo "Vibekit version: $(vibekit --version 2>/dev/null || echo 'not installed')"
echo "Bun version: $(bun --version 2>/dev/null || echo 'not installed')"
echo ""
echo "Next steps:"
echo "1. Use 'vibekit' to create and develop apps"
echo "2. Apps will be created in the 'apps/' directory"
echo "3. To create a systemd service for an app:"
echo "   ./manage-app-service.sh create <app-name> <port>"
echo ""
echo "Example:"
echo "   vibekit claude  # Start developing with Claude"
echo "   # After creating an app called 'myapp':"
echo "   ./manage-app-service.sh create myapp 3001"
echo ""
echo "Your server is accessible at http://YOUR_SERVER_IP/"
echo "Apps will be accessible at http://YOUR_SERVER_IP/xxx/ based on port mapping"
