function screenShot(url){
  const http = require('http');
  const fs = require('fs');
if (!url) {
  
} else {
  const link = `http://api.screenshotmachine.com?key=4516f8&url=${url}&dimension=1024x768`; 
  const file = fs.createWriteStream("views/screenshot.jpg");
  const request = http.get(link, function(response) {
   response.pipe(file);
   // after download completed close filestream
   file.on("finish", () => {
       file.close();
   });
});
}
}
module.exports = screenShot;
