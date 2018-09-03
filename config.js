

// this is used to store some configuration information for our server
// and also to centralize all the configuration of our server auth

const dbName = 'manski'

// 'mongoUrl': 'mongodb://localhost:27017/manski'
module.exports = {
  'secretKey': '12345-67890-09876-54321',
  'mongoUrl': `mongodb://localhost:27017/${dbName}`
}



