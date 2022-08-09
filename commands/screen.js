module.exports.run = (client, message, args, data, sendAlert, take_screenshot) => {
  /*var discord = require('discord.js');
  const http = require('http');
  const fs = require('fs');*/
  const url = message.content.split('/screen ')[1];
if (!url) {
  message.reply('Your typed null value, Please enter a valid value.').catch(console.error);
} else {
  message.reply("Please wait a few second's.").catch(console.error);
  let path = 'image/'+message.author.id+'.png';
  setTimeout(function() {
    save(path);
  }, 100);
}
function sendImg(path){
  message.reply({ files: [path] }).catch(console.error);
}
function save(path) {
  if (url.startsWith('http')) {
    take_screenshot(url, path, sendImg);
  } else {
    take_screenshot('http://'+url, path, sendImg);
  }
  /*setTimeout(function() {
    sendImg();
  }, 20000);*/
  /*var screenshotmachine = require('screenshotmachine'); 

var customerKey = '4516f8';
    secretPhrase = 'crawler'; //leave secret phrase empty, if not needed
    options = {
      //mandatory parameter
      url : url,
      // all next parameters are optional, see our website screenshot API guide for more details
      dimension : '1366x800', // or "1366xfull" for full length screenshot
      device : 'desktop',
      format: 'png',
      cacheLimit: '0',
      delay: '400',
      zoom: '100',
      click: ''
    }

var apiUrl = screenshotmachine.generateScreenshotApiUrl(customerKey, secretPhrase, options);

//or save screenshot as an image
var output = 'image/screenshot.png';
screenshotmachine.readScreenshot(apiUrl).pipe(fs.createWriteStream(output).on('close', function() {
  //console.log(apiUrl);
  //console.log('Screenshot saved as ' + output);
  setTimeout(function() {
    sendImg();
  }, 1000);
}));*/
}
}
