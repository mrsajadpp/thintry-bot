const scrapingbee = require('scrapingbee'); // Import ScrapingBee's SDK
const fs = require('fs');

async function take_screenshot(url, path, sendImg) {
  let er;
  var client = new scrapingbee.ScrapingBeeClient('AMLFM64NB4K383ILGUPXTN6GWQL1U9HS39QVZ00TNTA3LX1ZR9ZVOHJ39G27TUNPI4GAV5PAYA4QGQY4'); // New ScrapingBee client
  var response = await client.get({
    url: url,
    params: {
        'window_width': '1280', // Set viewport's width to 1280 px
        'window_height': '720', // Set viewport's height to 720 px
        'screenshot': 'true'
    }
}).then((response)=>fs.writeFileSync(path, response.data)) // Save the contents of the request (screenshot) to the 'path' file destination
.catch((e) =>er=true/*("An error has occured: " + e.message)*/);
if (er === false) {
  sendImg('image/screenshot.png');
} else {
  sendImg('image/error.png');
}
}
module.exports = take_screenshot;
