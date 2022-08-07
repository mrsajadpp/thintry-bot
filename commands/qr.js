module.exports.run = (client, message, args) => {
  const fs = require('fs');
  const qrUrl = 'http://api.qrserver.com/v1/create-qr-code/?size=150x150&data=';
  const link = message.content.split('/qr ')[1];
  if (!link) {
    message.reply('Please enter a value.').catch(console.error);
  } else {
    message.reply("Please wait a few second's.").catch(console.error);
    const url = qrUrl + link;
    qr(url);
  }
  function sendImg() {
    message.reply({ files: ['image/qr.png'] }).catch(console.error);
  }
  function qr(url) {
    var http = require('http'),
    Stream = require('stream').Transform,
    fs = require('fs');
    http.request(url, function(response) {
    var data = new Stream();
    response.on('data', function(chunk) {
       data.push(chunk);
    });
    response.on('end', function() {
       fs.writeFileSync('image/qr.png', data.read());
       setTimeout(function() {
         sendImg();
       }, 2000);
    });
    }).end();
  }
}
