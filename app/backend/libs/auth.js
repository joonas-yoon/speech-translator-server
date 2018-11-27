const passport = require('passport')
const jwt = require('jsonwebtoken')

const secret = process.env.SECRET
const expiresIn = 60 * 60

const auth = {
  getSecret () {
    return secret
  },
  signToken (id) {
    return jwt.sign({id}, secret, {expiresIn})
  },
  authenticate () {
    return passport.authenticate('jwt', { session : false })
  }
}

module.exports = auth
