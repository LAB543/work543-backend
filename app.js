// dependencies
var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
const YAML = require('yamljs')

// cors
var cors = require('cors')

// swagger-ui
const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./api-spec/v1/swagger.yaml');
const swaggerDocument = YAML.load('./api-spec/v1/swagger.yaml')

// router
var indexRouter = require('./routes/index')
var apiRouter = require('./routes/v1/index')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Swagger-ui
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use('/', indexRouter)

// Api part
app.options('*', cors())
app.use('/v1', apiRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
