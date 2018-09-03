
// this file is to store the
// AUTHENTICATION PASSPORT STRATEGY


const passport = require('passport');
const LocalStartegy = require('passport-local').Strategy;

var User = require('./models/user')

// this will provide us a JSON WEB TOKEN based 
// strategy for configuring our passport module
const JwtStrategy = require('passport-jwt').Strategy;

// we are requiring the ExtractJWT
const ExtractJwt = require('passport-jwt').ExtractJwt;

// we import the jswonwentoken library
const jwt = require('jsonwebtoken');


var config = require('./config');



///////////////////////////////////////////////////////////////////////////////
// use static authenticate method of model in LocalStrategy
const local = passport.use(new LocalStartegy(User.authenticate()))
module.exports = local

// exports.local = passport.use(new LocalStartegy(User.authenticate()))


// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
// use static serialize and deserialize of model for passport session support
passport.deserializeUser(User.deserializeUser())
///////////////////////////////////////////////////////////////////////////////


// this function will create the token and GET the token for us
module.exports.getToken = (user) => { 
  // this helps us create the JWT
  // 1. the first parament is the Payload which is the user
  // 2. the second parameter is the secretKey that we will get from the config file
  // 3. the third parameter is the duration of the cookie to be present
        // in your browser
  return jwt.sign(user, config.secretKey, {
    expiresIn:3600 
  });
};

// JWT based Strategy for our passport
const opts = {};

// this specifies how JWT be extracted from the incoming
// request message. that is why we have to use the ExtractJwt
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = config.secretKey;


// we will export the passport strategy
// by creating a new passport strategy
module.exports.jwtPassport = passport.use(new JwtStrategy(opts, 
  (jwt_payload, done) => {
    console.log("\nJWT Payload: ", jwt_payload)

    User.findOne({_id:  jwt_payload._id}, (err, user) => {
      if(err){
        return done(err, false)
      }
        else if (user) {
          return done(null, user)
        }
          else {
            return done(null, false)
          }
    })
  }));


// here we are going to verify another user
// on jwt token that we have created above
// the second part which is false is that we are not going to 
// create a new session
  module.exports.verifyUser = passport.authenticate('jwt', {session: false} )










