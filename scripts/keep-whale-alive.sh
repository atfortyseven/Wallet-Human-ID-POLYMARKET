#!/bin/bash

###############################################################################
# WHALE BOT KEEP-ALIVE SCRIPT
# 
# Ensures the whale monitoring bot runs 24/7 with automatic restart on failures
# Uses PM2 for process management with intelligent restart policies
###############################################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🐋 Human DeFi - Whale Monitor Keep-Alive System${NC}"
echo "=================================================="

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠️  PM2 not found. Installing globally...${NC}"
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed successfully${NC}"
fi

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null; then
    echo -e "${YELLOW}⚠️  ts-node not found. Installing...${NC}"
    npm install -g ts-node
    echo -e "${GREEN}✅ ts-node installed successfully${NC}"
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Check if whale-monitor is already running
if pm2 list | grep -q "whale-monitor.*online"; then
    echo -e "${YELLOW}⚠️  Whale monitor is already running. Restarting...${NC}"
    pm2 restart whale-monitor
    pm2 logs whale-monitor --lines 20
else
    echo -e "${GREEN}🚀 Starting whale monitor for the first time...${NC}"
    
    # Start with PM2 using ecosystem config
    pm2 start ecosystem.config.json
    
    # Save PM2 process list
    pm2 save
    
    # Setup PM2 to start on system boot
    echo -e "${GREEN}📌 Configuring PM2 startup on boot...${NC}"
    pm2 startup
    
    echo ""
    echo -e "${GREEN}✅ Whale monitor started successfully!${NC}"
    echo ""
    echo "📊 Monitor status:"
    pm2 status
    
    echo ""
    echo "📝 View logs with:"
    echo "   pm2 logs whale-monitor"
    echo ""
    echo "🔄 Restart with:"
    echo "   pm2 restart whale-monitor"
    echo ""
    echo "⏹️  Stop with:"
    echo "   pm2 stop whale-monitor"
fi

echo ""
echo -e "${GREEN}🎉 Whale bot is now running 24/7!${NC}"
echo "The bot will automatically restart if it crashes."
echo "Daily automatic restart at 4:00 AM."
