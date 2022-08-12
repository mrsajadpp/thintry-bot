const scrapingbee = require('scrapingbee'); // Import ScrapingBee's SDK
const fs = require('fs');
const del = require('./delete.js');
var grabzit = require('grabzit');
var client = new grabzit("NWQ1ZTRjM2U2OWY4NDljZDk1NWNmYWNhYTJjZGJlMTY=", "P3o/Pz8Oaj8/P2FcP18dPyk/Pz8/Pz8/P00/Pz91Zj8=");

function take_screenshot(url, path, sendImg){
  var options = {"format":"jpg"};
  client.url_to_image(url, options);
  client.save_to(path, function (error, id){
    if (error){
      sendImg('image/error.gif');
      console.log(error.code);
    } else {
      sendImg(path);
      setTimeout(function() {
        del(path);
      }, 2000);
    }
  });
}

/*async function take_screenshot(url, path, sendImg) {
  let er = 'no';
  var client = new scrapingbee.ScrapingBeeClient('AMLFM64NB4K383ILGUPXTN6GWQL1U9HS39QVZ00TNTA3LX1ZR9ZVOHJ39G27TUNPI4GAV5PAYA4QGQY4'); // New ScrapingBee client
  var response = await client.get({
    url: url,
    params: {
        'window_width': '1280', // Set viewport's width to 1280 px
        'window_height': '720', // Set viewport's height to 720 px
        'screenshot': 'true'
    }
}).then((response)=>fs.writeFileSync(path, response.data)) // Save the contents of the request (screenshot) to the 'path' file destination
.catch((e) =>er = e.message);
if (er == 'no') {
  sendImg(path);
  setTimeout(function() {
     del(path);
  }, 2000);
} else {
  sendImg('image/error.png');
}
}
//console.log("An error has occured: " + e.message)*/
module.exports = take_screenshot;
