// =====================================================
//  Серверная часть: наш WebSocket-сервер + поток Binance
// =====================================================

// Библиотека ws (установлена: npm install ws)
const WebSocket = require('ws');

// 1. Создаём собственный WebSocket-сервер на порту 8080
const wss = new WebSocket.Server({ port: 8080 });

console.log('[server] WebSocket-сервер запущен на порту 8080');

// 2. Подключаемся к WebSocket-API Binance.
//    Комбинированный поток: тикеры BTC, ETH, BNB, XRP (обновление ~1 раз/сек)
const BINANCE_URL =
  'wss://stream.binance.com:9443/stream?streams=' +
  ['btcusdt@ticker', 'ethusdt@ticker', 'bnbusdt@ticker', 'xrpusdt@ticker'].join('/');

const binance = new WebSocket(BINANCE_URL);

// Соединение с биржей установлено
binance.onopen = () => {
  console.log('[binance] Соединение с Binance установлено, приём котировок...');
};

// 3. Принимаем сообщения от Binance и транслируем их ВСЕМ клиентам
binance.onmessage = (event) => {
  const raw = event.data; // исходная строка (JSON) от Binance

  wss.clients.forEach((client) => {
    // отправляем только клиентам с открытым соединением
    if (client.readyState === WebSocket.OPEN) {
      client.send(raw);
    }
  });
};

// Соединение с биржей закрыто
binance.onclose = () => {
  console.log('[binance] Соединение с Binance закрыто');
};

// Ошибка соединения с биржей
binance.onerror = (error) => {
  console.error('[binance] Ошибка:', error.message);
};

// 4. Обрабатываем подключения браузеров-клиентов к нашему серверу
wss.on('connection', (client) => {
  console.log(`[server] Клиент подключился (всего: ${wss.clients.size})`);

  client.on('close', () => {
    console.log(`[server] Клиент отключился (всего: ${wss.clients.size})`);
  });
});
