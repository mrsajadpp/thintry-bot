function del(path) {
  fs.stat(path, function (err, stats) {
   //console.log(stats);
   if (err) {
       return console.error(err);
   }
   fs.unlink(path,function(err){
        if(err) return console.log(err);
        console.log('file deleted successfully');
   });  
  });
}
