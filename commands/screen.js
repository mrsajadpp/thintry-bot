module.exports.run = async (client, message, args, take_screenshot) => {
  const url = args[0];
if (!url) {
  await message.reply('Your typed null value, Please enter a valid value.').catch(console.error);
} else {
  await message.reply("Please wait a few second's.").catch(console.error);
  let path = 'image/'+message.author.id+'.png';
  setTimeout( async function() {
    await save(path);
  }, 100);
}
async function sendImg(path){
  await message.reply({ files: [path] }).catch(console.error);
}
async function save(path) {
  if (url.startsWith('http')) {
    await take_screenshot(url, path, sendImg);
  } else {
    await take_screenshot('http://'+url, path, sendImg);
  }
}
}
