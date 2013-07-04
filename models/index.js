var mongoose = require( 'mongoose' )
  , env, curativity, curaPass;
  if (process.env.VCAP_SERVICES) {
    env = JSON.parse(process.env.VCAP_SERVICES);
    db1 = env['mongodb-1.8'][0].credentials;
    curativity = mongoose.createConnection(db1.url);
    console.log('connected to Mongo');
  }
  else {
    var mongo = {
      curativity: 'mongodb://localhost:27017/CURATIVITY?safe=true',
      curaPass: 'mongodb://localhost:27017/CURAPASS?safe=true'
    };
    curativity = mongoose.createConnection(mongo.curativity);
    curaPass = mongoose.createConnection(mongo.curaPass);
    for (var key in mongo) {
      console.log(mongo[key]);
    }
  }

// Curativity Models
module.exports.Accounts = curativity.model('accounts', require('./schemas/account'));
module.exports.Passwords = curaPass.model('passwords', require('./schemas/password'));
