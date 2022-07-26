var express = require('express');
var app = express();
var path = require('path');
var router = express.Router();
var port = process.env.port || 3007;
var screenShot = require('./res/screenshot.js');
//Web server 
function listen(){
   app.listen(port, () => {
     console.log('Server running : '+port);
   });
}
//Routes
app.get('/', (req, res) => {
  res.send('Home');
}); 
app.get('*', (req, res) => {
  res.send('404');
});
module.exports = listen;
