@echo off
REM ###########################################################################
REM WHALE BOT KEEP-ALIVE SCRIPT (Windows) - Simplified
REM ###########################################################################

echo.
echo ====================================================
echo    Whale Monitor Keep-Alive System
echo ====================================================
echo.

REM Install PM2 if not present (ignore errors, will check later)
where pm2 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing PM2 globally...
    npm install -g pm2
)

REM Install ts-node if not present
where ts-node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing ts-node globally...
    npm install -g ts-node
)

echo.
echo Verifying PM2 installation...
where pm2 >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] PM2 is not available in PATH
    echo.
    echo Please install PM2 manually:
    echo   npm install -g pm2
    echo.
    echo Or run the whale bot directly:
    echo   npm run worker
    echo.
    pause
    exit /b 1
)

echo [OK] PM2 is ready
echo.

REM Create logs directory
if not exist "logs" mkdir logs

REM Check if already running
pm2 list | findstr /C:"whale-monitor" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Whale monitor is already running. Restarting...
    pm2 restart whale-monitor
    echo.
    pm2 logs whale-monitor --lines 10
) else (
    echo Starting whale monitor for the first time...
    
    REM Start with PM2
    pm2 start ecosystem.config.json
    
    REM Save PM2 list
    pm2 save
    
    echo.
    echo [SUCCESS] Whale monitor is now running!
)

echo.
echo ====================================================
echo Commands:
echo   pm2 logs whale-monitor    - View live logs
echo   pm2 restart whale-monitor - Restart bot
echo   pm2 stop whale-monitor    - Stop bot
echo   pm2 status                - Check status
echo ====================================================
echo.

pause
