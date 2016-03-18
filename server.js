var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function (req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('User connected');
  socket.on('Chat message', function(msg){
    console.log('received message: ' + msg);

    io.emit('Chat message', {
      message: msg,
      time: Date.now()
    });
  });
});

http.listen(3000, function () {
  console.log('Server started on port 3000.');
});
