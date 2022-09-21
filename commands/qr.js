module.exports.run = async (client, message, args) => {
  const fs = require('fs');
  const qrUrl = 'http://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';
  const del = require('../module/delete.js');
  const link = message.content.split('/qr ')[1];
  if (!link) {
    await message.reply('Please enter a value.').catch(console.error);
  } else {
    await message.reply("Please wait a few second's.").catch(console.error);
    const url = qrUrl + link;
    await qr(url);
  }
  async function sendImg() {
    await message.reply({ files: ['image/'+message.author.id+'.png'] }).catch(console.error);
  }
  async function qr(url) {
    var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');
    http.request(url, function(response) {
    var data = new Stream();
    response.on('data', function(chunk) {
       data.push(chunk);
    });
    response.on('end', function() {
       fs.writeFileSync('image/'+message.author.id+'.png', data.read());
       setTimeout(async function() {
         await sendImg();
         setTimeout(async function() {
            await del('image/'+message.author.id+'.png');
         }, 2000);
       }, 1000);
    });
    }).end();
  }
}
