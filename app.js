var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//if port is undefined app app will start on default 3000
port = process.env.PORT;
//there is not default password. App will not start without it.
const mongopass = process.env.MONGODB_PASS;
const mongohost = process.env.MONGODB_HOST;
//other params might be provided for user, db, etc.

mongoose.connect('mongodb://appuser:' + mongopass + '@' + mongohost + '/mytestdb');
var db = mongoose.connection;

//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log("connection established")
});

//use sessions for tracking logins
app.use(session({
  secret: 'fjwoejfj2j',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'));

var routes = require('./routes/router');
app.use(function(request, response, next){
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    let data = `${hour}:${minutes}:${seconds} ${request.method} ${request.url} ${request.get("user-agent")}`;
    console.log(data);
    next();
});
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  console.error(err.message);
  res.send(err.message);
});

app.listen(port, function () {
  console.log('Express app listening on port 3000');
});