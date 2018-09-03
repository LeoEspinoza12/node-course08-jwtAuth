var express = require('express');
const bodyParser = require('body-parser')
const User = require('../models/user')
var router = express.Router();

router.use(bodyParser.json());

const passport = require('passport');

const authenticate = require('../authenticate')



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//////////////////////////////////////////////////////////////////////
router.post('/signup', (req, res, next) => {
  
  // User.findOne({username: req.body.username})
  User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if(err){
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({"This is the error": {err: err}})
      }
        else{
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json');
            res.json({success: true, status: 'Registration successfull'})
          });
        }
    })
});


//////////////////////////////////////////////////////////////////////
router.post('/login', passport.authenticate('local'), (req, res, next) => {
  console.log(req.user._id)
  const token = authenticate.getToken({_id: req.user._id})
  res.statusCode = 200
    res.setHeader('Content-Type', 'application/json');
       res.json({success: true, token: token, status: 'You are succcessfully logged in'})
 


})


//////////////////////////////////////////////////////////////////////
router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  } else {
    var err = new Error('You are logged out!');
    err.status = 403;
    next(err);
  }
});
module.exports = router;

