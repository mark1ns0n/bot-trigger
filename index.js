const Telegraf = require('telegraf');
const _ = require('lodash');
const axios = require('axios');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => ctx.reply('Hey there!'));

bot.on('message', ctx => {
  const message = _.get(ctx, 'update.message', null);

  if (!message) {
    ctx.reply(`Can't see the message...`);
    return;
  }

  const command = (message.text).split(' ');
  if (!command.length) {
    ctx.reply(`Invalid request format: api path port`);
    return;
  }

  const port = command[1] || '80';
  if (!/^[\d]+$/ig.test(port)) {
    ctx.reply(`Port is not valid. Use digits or leave it empty (80)`);
    return;
  }

  const path = command[0];

  const url = `http://127.0.0.1:${port}${path}`;
  console.log(url);
  axios.get(url)
    .then(response => {
      ctx.reply(JSON.stringify(_.get(response, 'data', 'Empty response')));
    })
    .catch(err => {
      console.log(err);
      ctx.reply('Hustom we have a problem...');
    });
});

bot.launch();
