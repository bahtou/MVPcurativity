var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator');

var app = express();

app.configure(function(){
  app.set('port', process.env.VCAP_APP_PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress()); // compress responses
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(expressValidator);
  app.use(express.cookieParser('create'));
  app.use(express.cookieSession({
    key: 'create',
    secret: 'curateThis',
    cookie: {maxAge: 1*24*60*60*1000}
  }));

  // cache every file going out
  app.use(function(req, res, next) {
    if (!res.getHeader('Cache-Control')) {
      res.setHeader('Cache-Control', 'public, max-age=' + (86400 / 1000));
    }
    next();
  });

  // Expose the flash function to the view layer
  app.use(require('connect-flash')());
  app.use(function(req, res, next) {
  res.locals.flash = req.flash.bind(req);
  next();
  });

  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler({showStack: true, dumpExceptions: true}));
});

// app locals
app.locals({
  title: 'Curativity'
});

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
