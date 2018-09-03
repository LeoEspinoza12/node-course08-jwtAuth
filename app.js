const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser')

const session = require('express-session');
const FileStore = require('session-file-store')(session)

const passport = require('passport');
const authenticate = require('./authenticate')

const config = require('./config')


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

const mongoose = require('mongoose');


// here we are using the url that we have 
// set up in the config file
const url = config.mongoUrl; 
const connect = mongoose.connect(url, {
  useNewUrlParser: true
});
// const connect = mongoose.connect('mongodb://localhost:27017/manski', {
//   useNewUrlParser: true
// });





const dishes = require('./models/schema')

connect.then((db)=>{
  console.log('connected correctly to the server \n');
}, (err)=>{
  console.log(err)
});

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// set a secret code for the client
// app.use(cookieParser('12345-67890'));

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
  // WE DONT USE THIS ANYMORE FOR THE JWT
        // app.use(session({
        //   name: 'session-id', 
        //   secret: '12345-67890-09876-54321',
        //   // means that sessions are not stored for brand new 
        //   // session that are empty. No sessions will be stored
        //   // until the session has contents 
        //   saveUninitialized: false,
        //   // resave means this will update the session
        //   // on each page view even if it did not change
        //   // this helps sessions from expiring
        //   resave: false,
        //   store: new FileStore()
        // }))


// PASSPORT CONFIGURATION
// initialize the passport auth
app.use(passport.initialize());

/////////////////////////////////////////////////////////////////
// WE DONT USE THIS ANYMORE
        // create a support for the session
        // app.use(passport.session())


app.use('/', indexRouter);
app.use('/users', usersRouter);



/////////////////////////////////////////////////////////////////
// WE DONT USE THIS ANYMORE
      // function auth(req, res, next){
      //   console.log(`Response Headers: `, req.headers, ` \n\n `);
      //     if(!req.user){
      //       var err = new Error('Eey, no estas authenticado. \n Necesitas login \n');
      //           err.status = 403
      //             return next(err)
      //     }
      //     else {
      //         next();
      //     }
      // }
      // // call the auth function
      // app.use(auth)



// this is to send static pages if the user will not
// go to a specific route. the static pages are 
// placed in the public routes
app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/leaders', leaderRouter);
app.use('/promotions', promoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log('\nsampasdf\n')
  next(createError(404));
});

// this is basically a customed middleware that is called for every 
// request and this will pass an error if there is any
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log('Error: ', err)

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
