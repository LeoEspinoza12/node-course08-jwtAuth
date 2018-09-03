const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const passportLocalMongoose = require('passport-local-mongoose');





// require('mongoose-currency').loadType(mongoose);
// const Currency = mongoose.Types.Currency


const User = new Schema({
  admin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

User.plugin(passportLocalMongoose)


var Users = mongoose.model('User', User);

module.exports = Users;
