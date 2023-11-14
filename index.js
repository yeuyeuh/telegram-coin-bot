const fetch = require('node-fetch');
require('dotenv').config();
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Bienvenue! Envoyez /price <nom-de-la-crypto> pour obtenir le prix.'));

bot.command('price', async (ctx) => {
  const coin = ctx.message.text.split(' ')[1];

  if (!coin) {
    return ctx.reply('Utilisation correcte: /price <nom-de-la-crypto>');
  }

  try {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
    const data = await response.json();

    const price = data[coin]?.usd;

    if (price) {
      ctx.reply(`Le prix de ${coin} est actuellement $${price}`);
    } else {
      ctx.reply('Crypto non trouvée');
    }
  } catch (error) {
    console.error(error);
    ctx.reply('Une erreur s\'est produite lors de la récupération des données.');
  }
});

bot.launch();