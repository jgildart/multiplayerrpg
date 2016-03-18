var express = require('express');
var app = express();

app.get('/', function (req, res){
  res.send('Server starting');
});

app.listen(3000, function () {
  console.log('Server started on port 3000.');
});
