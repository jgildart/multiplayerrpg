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
app.post('/signup', function(req, res){
  var isEmail = require('validator/lib/isEmail');
  var User = require('./models/user');
  var bcrypt = require('bcrypt');

  if(req.body.username && req.body.email && req.body.password){
    if(!isEmail(req.body.email)){
      return res.sendStatus(400);
    }
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    User.create({
      username: req.body.username,
      password: hash,
      email:    req.body.email
    })
    .then(function(result){
      res.redirect('/');
    });
  } else {
    return res.sendStatus(400);
  }
});

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/login.html');
});

app.post('/login', function (req, res) {
  var User = require('./models/user');
  var bcrypt = require('bcrypt');

  if (req.body.username && req.body.password) {
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        // log them in
      } else {
        // redirect with an invalid login at /login
      }
    });
  } else {
    return res.sendStatus(400);
  }
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
