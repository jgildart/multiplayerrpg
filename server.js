var app = require('express')();
var http = require('http').Server(app);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var io = require('socket.io')(http);
var redis = require('redis');
var session = require('express-session');
var RedisStore = require('connect-redis')(session);

// try to load the config
try {
  var config = require('./config/dev');
} catch(e) {
  throw new Error('You must implement config/dev.js for your local environment');
}

var redisClient = redis.createClient(config.redis.port, config.redis.host);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'this can be anything! this can even be this!',
  store: new RedisStore({
    client: redisClient,
    prefix: 'game_sess:'
  }),
  resave: false,
  saveUninitialized: false
}));

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
