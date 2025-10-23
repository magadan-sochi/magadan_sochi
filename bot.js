// bot.js
const TelegramBot = require('node-telegram-bot-api');

// --- ВАЖНО ---
// Замените 'ВАШ_ТЕЛЕГРАМ_ТОКЕН' на реальный токен вашего бота, полученный от @BotFather.
const token = '7581585995:AAEk9rttJstRqocPgVSLzjB-QDl-uy3CrXY';
// ---

// URL вашего веб-приложения на GitHub Pages.
// Эта ссылка сгенерирована на основе файла vite.config.ts и стандартной структуры GitHub Pages.
const webAppUrl = 'https://magadan-sochi.github.io/magadan_sochi/';

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  // Отправляем приветственное сообщение с кнопкой для открытия веб-приложения
  bot.sendMessage(chatId, "Добро пожаловать в Магадан Гейм! Нажмите кнопку ниже, чтобы начать.", {
    reply_markup: {
      // Создаем встроенную клавиатуру с одной кнопкой
      inline_keyboard: [
        [{ 
          text: '🚀 Начать обучение', 
          web_app: { url: webAppUrl } 
        }]
      ]
    }
  });
});

// Выводим сообщение в консоль, чтобы убедиться, что бот запустился
console.log('Бот "Магадан Гейм" успешно запущен!');
console.log('Он будет открывать веб-приложение по адресу:', webAppUrl);
