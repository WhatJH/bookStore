var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var orderRouter = require('./routes/order');
var joinUserRouter = require('./routes/joinUser');
// var orderListRouter = require('./routes/order');

//1. JS 파일 연결
var logineRouter = require('./routes/login');
var cartlistRouter = require('./routes/cartlist');
var reviewRouter = require('./routes/review');

var app = express();

const util = require('util');


var mysql = require('mysql2');

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'bookStore2',
  port: 3306
})

db.connect(function(err) {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Promisify the query function
db.query = util.promisify(db.query);
// MySQL 연결을 모든 라우터에서 사용할 수 있도록 설정
app.use((req, res, next) => {
  req.db = db;
  next();
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', productRouter);
app.use('/order', orderRouter);
app.use('/joinUser', joinUserRouter);
app.use('/cartlist', cartlistRouter);
app.use('/review', reviewRouter);


// 2. JS 파일에서 어떤 url쓸거야?
app.use('/login', logineRouter);

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
