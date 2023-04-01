const { Telegraf } = require('telegraf');
const axios = require('axios');


const mySecret = process.env['BOT_TOKEN'];
const bot = new Telegraf(mySecret);

bot.start((ctx) => {
  ctx.reply('Hello! I am a Telegram bot.');
});

bot.help((ctx) => {
  ctx.reply('This is a sample bot created with Telegraf.');
});

bot.command('echo', (ctx) => {
  const text = ctx.message.text.slice(6);
  ctx.reply(text);
});

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  // Check if the message is an HTTP code
  if (/^\d{3}$/.test(text)) {
    const code = parseInt(text, 10);
    const dogImageUrl = await getDogImageUrl(code);
    if (dogImageUrl) {
      ctx.replyWithPhoto(dogImageUrl);
    } else {
      ctx.reply(`Sorry, I don't have a dog image for HTTP ${code}.`);
    }
  } else {
    ctx.reply('You said: ' + text);
  }
});

async function getDogImageUrl(code) {
  try {
    const response = await axios.get(`https://httpstatusdogs.com/img/${code}.jpg`, {
      responseType: 'arraybuffer',
    });
    return { source: response.data };
  } catch (err) {
    console.error(`Failed to fetch dog image for HTTP ${code}: ${err.message}`);
    return null;
  }
}

bot.launch();
