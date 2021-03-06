import * as jwt from 'jsonwebtoken';
import { Auth } from '../routes/auth';
import { secret } from '../routes/config/secret';



export class ValidateRequest {

  private auth: Auth;
  protected dbUser;

  constructor() {
    this.auth = new Auth();
  }

  async validateRequest(req, res, next) {

    // When performing a cross domain request, you will recieve
    // a preflighted request first. This is to check if our the app
    // is safe.

    // We skip the token outh for [OPTIONS] requests.
    // if(req.method == 'OPTIONS') next();

    const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];

    if (token) {
      try {
        const decoded = await jwt.verify(token, secret(), { algorithm: 'HS256' });

        if (decoded.exp <= Math.floor(Date.now() / 1000)) {
          res.status(401);
          res.json({
            'status': 401,
            'message': 'Token Expired'
          });
          return;
        }

        // Authorize the user to see if s/he can access our resources
        this.dbUser = await this.auth.validateUser(decoded.username); // The db user would be the logged in user's username
        if (this.dbUser) {


          if ((req.url.indexOf('admin') >= 0 && this.dbUser.title === 'admin') ||
            (req.url.indexOf('admin') < 0 && req.url.indexOf('/api/v1/') >= 0)) {
            next(); // To move to next middleware
          } else {
            res.status(403);
            res.json({
              'status': 403,
              'message': 'Not Authorized'
            });
            return;
          }
        } else {
          // No user with this name exists, respond back with a 401
          res.status(401);
          res.json({
            'status': 401,
            'message': 'Invalid User'
          });
          return;
        }

      } catch (err) {
        res.status(500);
        res.json({
          'status': 500,
          'message': 'Oops something went wrong',
          'error': '' + err
        });

      }
    } else {
      res.status(401);
      res.json({
        'status': 401,
        'message': 'Invalid Token'
      });
      return;
    }

  }
}
