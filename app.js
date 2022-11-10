
var createError = require('http-errors');

const express = require('express');
const handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')
const expressValidator = require('express-validator');
var session = require('express-session')
const flash=require('connect-flash');
const passport=require('passport');
var path = require('path');

var cookieParser = require('cookie-parser');

var logger = require('morgan');

const mongoose =require('mongoose');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const { extname } = require('path');
const url = 'mongodb://127.0.0.1:27017/shoping-cart'

var app = express();

// conect DB
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

require('./confg/passport');
// view engine setup
app.engine('hbs', expressHandlebars.engine({ extname: 'hbs', 
  defaultLayout: 'mainLayout', 
  handlebars: allowInsecurePrototypeAccess(handlebars), 
  helpers:{
          add:function (value) { return value+1;},

          checkQuantity:function (value) { 
            if(value<=1)
            return true;
              else return false;
          }
},
  layoutsDir: __dirname + '/views/layouts/' })
);  
app.set('view engine', 'handlebars');
// important
app.set('view engine', '.hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(session({
  secret: 'keyboard cat',
  // true to save new session to old sesstion
  resave: true,
  saveUninitialized: false
  
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
