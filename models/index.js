var mongoose = require( 'mongoose' )
  , env, signUp;
  if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES);
    db1 = env['mongodb-1.8'][0].credentials;
    cura = mongoose.createConnection(db1.url);
    console.log('connected to Mongo');
  }
  else {
    var mongo = {
      cura: 'mongodb://localhost:27017/CURA?safe=true'
    };
    cura = mongoose.createConnection(mongo.cura),
    console.log('connected to Mongo@localhost:' +cura.port +'/CURA');
  }

// General Models
module.exports.SignUps = cura.model('signup', require('./schemas/signUp'));
