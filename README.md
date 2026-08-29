# Котировки криптовалют через WebSocket

Клиент-серверное приложение: Node.js-сервер получает поток котировок
с WebSocket-API Binance и транслирует его браузерам в реальном времени.

## Требования
- Node.js 16+ и npm
- Доступ к сети для подключения к stream.binance.com

## Запуск
1. `npm install`
2. `npm start`  (сервер поднимается на ws://localhost:8080)
3. Открыть `public/index.html` в браузере

## Структура
- `server.js` — WebSocket-сервер и подключение к Binance;
- `public/index.html` — клиент: статус подключения и карточки котировок.
