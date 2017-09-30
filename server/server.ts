import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as compression from 'compression';
import * as express from 'express';
import * as logger from 'morgan';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as errorhandler from 'errorhandler';
import * as mongoose from 'mongoose';
import * as config from 'config';

import { Routes } from './routes';
import { ValidateRequest } from './middlewares/validateRequest';

import expressValidator = require('express-validator');

const app: express.Application = express();

if (config.get('app.enableGzipCompression') === true) {
  // compress all responses
  app.use(compression({
    threshold: 0
  }));
}

app.disable('x-powered-by'); // security

if ('development' === app.get('env') || 'test' === app.get('env')) {
  // only use in development (stack traces/errors and etc)
  app.use(errorhandler());
  console.log('NODE_ENV: ' + app.get('env'));
  console.log('mongo config address: ' + config.get('db.host') + '/' + config.get('db.name'));
}

// Point static path to dist
app.use(express.static(path.join(__dirname, '../dist')));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(expressValidator()); // this line must be immediately after express.bodyParser()!

/*******************************************************************************
*                                  Database                                    *
*******************************************************************************/

// Use native Node promises
mongoose.Promise = global.Promise;

const connectionString = config.get('db.scheme') + config.get('db.user') + ':' + config.get('db.password') + '@' +
  config.get('db.host') + '/' + config.get('db.name');

const connectionOptions = {
  useMongoClient: true
};

if (process.env.MONGOLAB_URI) {
  mongoose.connect(process.env.MONGOLAB_URI)
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error(err));
} else {
  mongoose.connect(connectionString, connectionOptions)
    .then(() => console.log('MongoDB connection successful'))
    .catch((err) => console.error(err));
}

/*******************************************************************************
*                                   Routes                                     *
*******************************************************************************/

app.all('/*', function (req, res, next) {
  // CORS headers
  res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // Set custom headers for CORS
  res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Refresh-Token');
  if (req.method === 'OPTIONS') {
    res.status(200).end();
  } else {
    next();
  }
});

// Auth Middleware - This will check if the token is valid
// Only the requests that start with /api/v1/* will be checked for the token.
// Any URL's that do not follow the below pattern should be avoided unless you
// are sure that authentication is not needed

app.all('/api/v1/*', function (req, res, next) {
  const validateRequest = new ValidateRequest();
  validateRequest.validateRequest(req, res, next);
});

// Routes init
const router = new Routes().router;
app.use('/', router);

// i18n for frontend
app.use('/i18n', express.static(path.join('./i18n')));

// Catch all other routes and return the index file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

/*******************************************************************************
*                              Server initialization                           *
*******************************************************************************/

/*
 *
 * HTTP configuration
 *
 */
let server;

if (config.get('app.httpsEnabled') === false) {

  app.set('port', process.env.PORT || config.get('app.port.http'));

  server = app.listen(app.get('port'), function () {
    console.log('HTTP server listening on port %d in %s mode', server.address().port, app.settings.env);
  });
} else {

  /*
   *
   *  HTTPS Configuration
   *
   */

  const options = {
    key: fs.readFileSync(config.get('app.privateKey'), 'utf8'),
    cert: fs.readFileSync(config.get('app.certificate'), 'utf8')
  };

  app.set('port', process.env.PORT || config.get('app.port.https'));

  server = https.createServer(options, app).listen(app.get('port'), function () {
    console.log('HTTPS server listening on port %d in %s mode', server.address().port, app.settings.env);
  });
}

export { server };
