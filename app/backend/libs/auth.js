const jwt = require('jsonwebtoken');
const passport = require('passport');

const secret = process.env.SECRET;
const expiresIn = 60 * 60;

const auth = {
  getSecret() {
    return secret;
  },
  signToken({ id, username }) {
    return jwt.sign({ id, username }, secret, { expiresIn });
  },
  authenticate() {
    return (req, res, next) => {
      try {
        const { authorization } = req.headers;
        const decoded = jwt.verify(
          authorization.replace(/^Bearer\s/, ''),
          secret
        );
        req.user = decoded;
      } catch (e) {}
      next();
    };
  },
  requireAuthenticated() {
    return passport.authenticate('jwt', { session: false });
  },
};

module.exports = auth;
