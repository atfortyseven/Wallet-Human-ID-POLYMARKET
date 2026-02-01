# Iniciar Bot de Whales - Guía Rápida

## ⚡ Método Más Simple (Recomendado)

Ejecuta estos comandos en orden:

```bash
# 1. Instalar PM2 (solo una vez)
npm install -g pm2

# 2. Verificar que PM2 funciona
pm2 --version

# 3. Iniciar el bot
pm2 start ecosystem.config.json

# 4. Guardar para que inicie automáticamente
pm2 save

# 5. Ver logs en tiempo real
pm2 logs whale-monitor
```

## 🚀 Método Alternativo (Sin PM2)

Si PM2 no funciona, ejecuta directamente:

```bash
npm run worker
```

**Nota**: Este método NO reinicia automáticamente si el bot se cae.

## 📊 Comandos Útiles

```bash
# Ver estado del bot
pm2 status

# Ver logs
pm2 logs whale-monitor

# Reiniciar
pm2 restart whale-monitor

# Detener
pm2 stop whale-monitor

# Ver monitor en tiempo real
pm2 monit
```

## ✅ Verificar que Funciona

Deberías ver mensajes como:
```
🐋 [Whale Worker] Background monitoring started on Base Mainnet...
📡 [Whale Worker] Starting from block: 123456
💓 [Whale Worker] Heartbeat - Scanning block...
```

## 🐛 Solución de Problemas

### Error: "PM2 command not found"

**Solución 1**: Cierra y vuelve a abrir la terminal

**Solución 2**: Instala PM2 de nuevo
```bash
npm install -g pm2 --force
```

**Solución 3**: Usa el método alternativo sin PM2
```bash
npm run worker
```

### Error: "Failed to connect to database"

Verifica que las variables de entorno están configuradas:
```bash
echo %DATABASE_URL%
echo %ALCHEMY_API_KEY%
echo %TELEGRAM_BOT_TOKEN%
```

Si están vacías, configúralas en `.env`

### Bot no envía alertas a Telegram

1. Verifica el token: `echo %TELEGRAM_BOT_TOKEN%`
2. Verifica que el bot esté agregado al canal `@HumanidFi`
3. Verifica que el topic ID sea correcto (1367)

## 🎯 Configuración Rápida

Edita `.env`:
```env
ALCHEMY_API_KEY=tu-api-key-aqui
TELEGRAM_BOT_TOKEN=8400528150:AAGtzfSpSvD6HgauHwg7Nw3sGElQx1Ug4rg
DATABASE_URL=postgresql://...
```

Luego ejecuta:
```bash
pm2 start ecosystem.config.json
pm2 save
```

¡Listo! El bot ahora funciona 24/7. 🐋
