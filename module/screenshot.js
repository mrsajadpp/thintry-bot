const scrapingbee = require('scrapingbee'); // Import ScrapingBee's SDK
const fs = require('fs');
const del = require('./delete.js');
var grabzit = require('grabzit');
var client = new grabzit("NWQ1ZTRjM2U2OWY4NDljZDk1NWNmYWNhYTJjZGJlMTY=", "P3o/Pz8Oaj8/P2FcP18dPyk/Pz8/Pz8/P00/Pz91Zj8=");

async function take_screenshot(url, path, sendImg){
  var options = {"format":"jpg"};
  client.url_to_image(url, options);
  client.save_to(path, async function (error, id){
    if (error){
      await sendImg('image/error.gif');
    } else {
      await sendImg(path);
      setTimeout(async function() {
        await del(path);
      }, 2000);
    }
  });
}
module.exports = take_screenshot;
