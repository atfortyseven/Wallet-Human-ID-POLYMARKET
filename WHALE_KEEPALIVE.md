# Whale Monitor Keep-Alive - Quick Start Guide

## What This Does

Keeps your whale monitoring bot running **24/7** with automatic restart on failures.

## Features

✅ **Auto-Restart**: Restarts automatically if the bot crashes  
✅ **Daily Reboot**: Automatically restarts at 4:00 AM daily for fresh memory  
✅ **Persistent Logging**: All alerts saved to `logs/whale-monitor-*.log`  
✅ **Memory Management**: Restarts if memory usage exceeds 500MB  
✅ **Exponential Backoff**: Intelligent restart delays to prevent spam  
✅ **Boot Persistence**: Starts automatically when server reboots  

## Quick Start

### Option 1: Windows

```bash
# Double-click or run:
scripts\keep-whale-alive.bat
```

### Option 2: Linux/Mac

```bash
# Make executable
chmod +x scripts/keep-whale-alive.sh

# Run
./scripts/keep-whale-alive.sh
```

### Option 3: Direct PM2 (Any OS)

```bash
# Install PM2 globally
npm install -g pm2 ts-node

# Start the bot
pm2 start ecosystem.config.json

# Save for auto-start on boot
pm2 save
pm2 startup
```

## Configuration

Edit `ecosystem.config.json` to configure:

```json
{
  "env": {
    "ALCHEMY_API_KEY": "your-alchemy-key",
    "TELEGRAM_BOT_TOKEN": "your-bot-token"
  }
}
```

Or set environment variables in your system.

## Monitoring Commands

```bash
# View live logs
pm2 logs whale-monitor

# Check status
pm2 status

# Monitor with dashboard
pm2 monit

# Restart manually
pm2 restart whale-monitor

# Stop
pm2 stop whale-monitor

# Remove from PM2
pm2 delete whale-monitor
```

## Log Files

All logs are saved to:
- **Success logs**: `logs/whale-monitor-out.log`
- **Error logs**: `logs/whale-monitor-error.log`

## Auto-Restart Policies

The bot will automatically restart:
- If it crashes or exits with error
- If memory usage exceeds 500MB
- Every day at 4:00 AM (cron)
- After minimum 10 seconds uptime (prevents rapid restart loops)

## Troubleshooting

### Bot won't start

1. Check environment variables are set:
   ```bash
   echo $ALCHEMY_API_KEY
   echo $TELEGRAM_BOT_TOKEN
   ```

2. View error logs:
   ```bash
   pm2 logs whale-monitor --err --lines 50
   ```

3. Try running directly to see errors:
   ```bash
   npm run ts-node scripts/whale-worker.ts
   ```

### Bot keeps restarting

Check logs for errors:
```bash
pm2 logs whale-monitor --lines 100
```

Common issues:
- Invalid API keys
- Network connectivity problems
- Prisma database connection errors

### Stop all auto-restart

```bash
# Disable auto-restart
pm2 stop whale-monitor --no-autorestart

# Or completely remove
pm2 delete whale-monitor
```

## Production Deployment (Railway/Vercel)

For cloud deployments, add to your `package.json`:

```json
{
  "scripts": {
    "whale:start": "pm2-runtime start ecosystem.config.json",
    "whale:logs": "pm2 logs whale-monitor"
  }
}
```

Then deploy with:
```bash
npm run whale:start
```

## Health Check Endpoint

The whale worker runs independently, but you can create a health check:

```bash
# Check if process is online
pm2 jlist | grep -q "whale-monitor.*online" && echo "HEALTHY" || echo "DOWN"
```

---

**Need Help?** Check `logs/whale-monitor-error.log` for detailed error messages.
