// jwt
var jwt = require('jwt-simple')
var jwtConfig = require('../../secret/jwt_config')

// get model
var models = require('../../models/index.js')

var bcrypt = require('bcrypt-nodejs')

module.exports = function (req, res, next) {
  if (req.method === 'GET') {
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

    models.User.findOne({
      attributes: [
        'id', 'username', 'email',
        'firstName', 'lastName',
        'createAt', 'updatedAt'
      ],
      where: { id: decodedToken.id }
    }).then(user => {
      console.log(user)
    }).catch(err => {
      console.log(err)
    })
  } else if (req.method === 'POST') {
    // user creation
    var username = req.body !== {} && req.body.username
      ? req.body.username : null
    var password = req.body !== {} && req.body.password
      ? req.body.password : null
    var firstName = req.body !== {} && req.body.firstName
      ? req.body.firstName : null
    var lastName = req.body !== {} && req.body.lastName
      ? req.body.lastName : null
    var email = req.body !== {} && req.body.email
      ? req.body.email : null

    console.log(req.body)

    if (username !== null && password !== null &&
      firstName !== null && lastName !== null && email !== null) {
      bcrypt.hash(password, null, null, function (err, hash) {
        if (err) throw new Error('Error caused')

        models.User.create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
          email: email
        }).then(user => {
          res.status(201)
            .send({
              code: 201,
              type: req.method,
              message: 'OK'
            })
        }).catch(err => {
          switch (err.parent.code) {
            case 'ER_DUP_ENTRY':
              return res.status(500)
                .send({
                  code: 500,
                  type: req.method,
                  message: 'Username or email already exist'
                })
            default:
              return res.status(500)
                .send({
                  code: 500,
                  type: req.method,
                  message: err.parent.error
                })
          }
        })
      })
    } else {
      res.status(401)
        .send({
          code: 401,
          type: req.method,
          message: 'Missing parameter: username, password, firstName, lastName, email required'
        })
    }
  // } else if(req.method === 'PUT') {
  // } else if(req.method === 'DELETE') {
  } else {
    // invalid method
    res.status(405)
      .send({
        code: 405,
        type: req.method,
        message: 'Invalid method: GET, POST accepted'
      })
  }
}
