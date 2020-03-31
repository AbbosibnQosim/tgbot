const TelegramBot = require('node-telegram-bot-api');
const ogs = require('open-graph-scraper');
const firebase = require('firebase');
const token = '1148131163:AAEijBykQTt9fQNOG55AdHfrTRhDuMVA1s4';
const bot = new TelegramBot(token, {polling: true});

const app = firebase.initializeApp({
  apiKey: "AIzaSyAphdjlrzfCM3N2-zyH3zrDLunn32GmG1s",
    authDomain: "bottelegram-444f4.firebaseapp.com",
    databaseURL: "https://bottelegram-444f4.firebaseio.com",
    projectId: "bottelegram-444f4",
    storageBucket: "bottelegram-444f4.appspot.com",
    messagingSenderId: "250005157546",
    appId: "1:250005157546:web:4ec0b66d4637ada94b42d3",
    measurementId: "G-1YNK4B2LH8"
});
const ref = firebase.database().ref();
const sitesRef = ref.child("sites");

let siteUrl;

// Reply to /bookmark
bot.onText(/\/bookmark (.+)/, (msg, match) => {
	console.log("Hello");
  siteUrl = match[1];
  bot.sendMessage(msg.chat.id,'Got it, in which category?', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: 'Development',
          callback_data: 'development'
        },{
          text: 'Music',
          callback_data: 'music'
        },{
          text: 'Cute monkeys',
          callback_data: 'cute-monkeys'
        }
      ]]
    }
  });
});

// Callback query
bot.on("callback_query", (callbackQuery) => {
  const message = callbackQuery.message;
  // Scrap OG date
  ogs({'url': siteUrl}, function (error, results) {
    if(results.success) {
      // Push to Firebase
      sitesRef.push().set({
        name: results.data.ogSiteName,
        title: results.data.ogTitle,
        description: results.data.ogDescription,
        url: siteUrl,
        thumbnail: results.data.ogImage.url,
        category: callbackQuery.data
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Added \"' + results.data.ogTitle +'\" to category \"' + callbackQuery.data + '\"!');
    } else {
      // Push to Firebase
      sitesRef.push().set({
        url: siteUrl
      });
      // Reply 
      bot.sendMessage(message.chat.id,'Added new website, but there was no OG data!');
    }
  });
});
