var jwt = require('jwt-simple')
var jwtConfig = require('../../secret/jwt_config')

// get model
var models = require('../../models/index.js')

var bcrypt = require('bcrypt-nodejs')

module.exports = function (req, res, next) {
  if (req.route.path === '/login') {
    var username = null
    var password = null

    if (req.method === 'GET' || req.method === 'POST') {
      // getting parameters
      if (req.body !== {} &&
        typeof (req.body.username) !== 'undefined' &&
        typeof (req.body.password) !== 'undefined') {
        username = req.body.username
        password = req.body.password
      } else if (req.params !== {} &&
        typeof (req.params.username) !== 'undefined' &&
        typeof (req.params.password) !== 'undefined') {
        username = req.params.username
        password = req.params.password
      } else if (req.query !== {} &&
        typeof (req.query.username) !== 'undefined' &&
        typeof (req.query.password) !== 'undefined') {
        username = req.query.username
        password = req.query.password
      }

      // processing
      if (username !== null && password !== null &&
        username !== '' && password !== '') {
        // get user info
        models.User.findOne({
          attributes: [
            'id', 'username', 'email', 'password',
            'firstName', 'lastName', 'isAdmin',
            'createdAt', 'updatedAt'
          ],
          where: { username: username }
        }).then((user) => {
          if (!user) throw new Error('User not found')

          bcrypt.compare(
            password, user.dataValues.password,
            (err, result) => {
              if (err) throw new Error('Error caused')

              if (result) {
                delete user.dataValues['password']
                res.status(200)
                  .send({
                    code: 200,
                    type: req.method,
                    message: 'OK',
                    data: {
                      user: user.dataValues
                    }
                  })
              } else {
                throw new Error('Password not matched')
              }
            })
        }).catch((err) => {
          // console.log(err);
          res.status(401)
            .send({
              code: 401,
              type: req.method,
              message: 'Invalid username/password supplied' + err
            })
        })
      } else { // missing parameters
        res.status(400)
          .send({
            code: 400,
            type: req.method,
            message: 'Missing parameter: username, password required'
          })
      }
    } else {
      // invalid method
      res.status(405)
        .send({
          code: 405,
          type: req.method,
          message: 'Invalid method: GET, POST accepted'
        })
    }
  } else if (req.route.path === '/logout') {
    // 토큰 전달
    const token = req.headers['x-access-token'] || req.query.token

    // 토큰이 없는 경우
    if (!token) {
      return res.status(403).json({
        code: 403,
        type: req.method,
        message: 'x-access-token required'
      })
    }

    var decodedToken = jwt.decode(token, jwtConfig.jwtSecret)

    // expiration config 변환 필요
    models.User.update({
      token: '',
      token_expiration: ''
    }, {
      where: { id: decodedToken.id }
    }).then(() => {
      res.status(200)
        .send({
          code: 200,
          type: req.method,
          message: 'OK'
        })
    }).catch((err) => {
      res.status(500)
        .send({
          code: 500,
          type: req.method,
          message: err.message
        })
    })
  } else {
    // invalid connection
    res.status(400)
      .send({
        code: 200,
        type: req.method,
        message: 'Invalid connection'
      })
  }
}
