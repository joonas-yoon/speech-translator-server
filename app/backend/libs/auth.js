const jwt = require('jsonwebtoken')
const secret = process.env.SECRET;
const expiresIn = 60 * 60;

const auth = {
  getSecret () {
    return secret
  },
  signToken (id) {
    return jwt.sign({id}, secret, {expiresIn})
  },
  authenticate () {
    return (req, res, next) => {
      const {authorization} = req.headers
      if (!authorization) {
        res.status(401).json({message: 'No Authorization headers'})
      }

      try {
        req.user = this.verify(authorization)
      } catch (e) {
        res.status(401).json({error: e})
      }

      next()
    }
  },
  verify (token) {
    return jwt.verify(token.replace(/^Bearer\s/, ''), secret)
  }
}

module.exports = auth
