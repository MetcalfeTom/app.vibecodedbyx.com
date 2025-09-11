#!/bin/bash

# Helper script to manage app services after they're created with Vibekit
# Usage: ./manage-app-service.sh <action> <app-name> [port]
# Actions: create, start, stop, restart, remove, status

set -e

ACTION=$1
APP_NAME=$2
PORT=$3

if [ -z "$ACTION" ] || [ -z "$APP_NAME" ]; then
    echo "Usage: $0 <action> <app-name> [port]"
    echo ""
    echo "Actions:"
    echo "  create <app-name> <port>  - Create systemd service for an app"
    echo "  start <app-name>          - Start the app service"
    echo "  stop <app-name>           - Stop the app service"
    echo "  restart <app-name>        - Restart the app service"
    echo "  remove <app-name>         - Remove the app service"
    echo "  status <app-name>         - Show app service status"
    echo "  list                      - List all vibe app services"
    echo ""
    echo "Example:"
    echo "  $0 create myapp 3013"
    echo "  $0 restart myapp"
    exit 1
fi

APP_DIR="$(dirname "$0")/apps/$APP_NAME"
SERVICE_NAME="vibe-$APP_NAME"

case "$ACTION" in
    create)
        if [ -z "$PORT" ]; then
            echo "Error: Port number required for create action"
            exit 1
        fi
        
        if [ ! -d "$APP_DIR" ]; then
            echo "Error: App directory $APP_DIR does not exist"
            echo "Make sure you've created the app with Vibekit first"
            exit 1
        fi
        
        if [ ! -f "$APP_DIR/server.ts" ]; then
            echo "Error: No server.ts found in $APP_DIR"
            exit 1
        fi
        
        echo "Creating systemd service for $APP_NAME on port $PORT..."
        
        # Create systemd service file
        sudo tee /etc/systemd/system/$SERVICE_NAME.service > /dev/null << EOF
[Unit]
Description=Vibe App - $APP_NAME
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(realpath $APP_DIR)
Environment="PORT=$PORT"
ExecStart=$(which bun) run server.ts
Restart=always
RestartSec=10
StandardOutput=append:/var/log/sloppy/$APP_NAME.log
StandardError=append:/var/log/sloppy/$APP_NAME.error.log

[Install]
WantedBy=multi-user.target
EOF
        
        # Create log directory if it doesn't exist
        sudo mkdir -p /var/log/sloppy
        sudo chown $USER:$USER /var/log/sloppy
        
        # Reload systemd and enable service
        sudo systemctl daemon-reload
        sudo systemctl enable $SERVICE_NAME
        sudo systemctl start $SERVICE_NAME
        
        echo "✓ Service created and started for $APP_NAME on port $PORT"
        echo "  View logs: sudo journalctl -u $SERVICE_NAME -f"
        echo "  Or: tail -f /var/log/sloppy/$APP_NAME.log"
        ;;
        
    start)
        echo "Starting $SERVICE_NAME..."
        sudo systemctl start $SERVICE_NAME
        echo "✓ Started"
        ;;
        
    stop)
        echo "Stopping $SERVICE_NAME..."
        sudo systemctl stop $SERVICE_NAME
        echo "✓ Stopped"
        ;;
        
    restart)
        echo "Restarting $SERVICE_NAME..."
        sudo systemctl restart $SERVICE_NAME
        echo "✓ Restarted"
        ;;
        
    remove)
        echo "Removing $SERVICE_NAME..."
        sudo systemctl stop $SERVICE_NAME 2>/dev/null || true
        sudo systemctl disable $SERVICE_NAME 2>/dev/null || true
        sudo rm -f /etc/systemd/system/$SERVICE_NAME.service
        sudo systemctl daemon-reload
        echo "✓ Service removed"
        ;;
        
    status)
        sudo systemctl status $SERVICE_NAME --no-pager
        ;;
        
    list)
        echo "=== Vibe App Services ==="
        echo ""
        # List all vibe services with their ports
        for service in /etc/systemd/system/vibe-*.service; do
            if [ -f "$service" ]; then
                name=$(basename "$service" .service)
                port=$(grep "PORT=" "$service" | cut -d= -f2 | tr -d '"')
                status=$(systemctl is-active "$name" 2>/dev/null || echo "inactive")
                
                if [ "$status" = "active" ]; then
                    echo "✓ $name (port $port) - active"
                else
                    echo "✗ $name (port $port) - $status"
                fi
            fi
        done
        
        if [ ! -f /etc/systemd/system/vibe-*.service ]; then
            echo "No vibe app services found"
        fi
        ;;
        
    *)
        echo "Error: Unknown action '$ACTION'"
        echo "Valid actions: create, start, stop, restart, remove, status, list"
        exit 1
        ;;
esac