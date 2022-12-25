const { StatusCodes } = require('http')
const errorHandlerMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || 'Something went wrong',
    statusCode: err.status || 500,
  }

  if (err.name === 'CastError') {
    customError.msg = `No such user with id: ${err.value}`
    customError.statusCode = 404
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate Error: A user with same ${Object.keys(
      err.keyValue
    )} exists`

    customError.statusCode = 400
  }

  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors)
      .map((item) => item.message)
      .join(',')

    customError.statusCode = 400
  }
  // return res.status(500).json({ err })
  return res.status(customError.statusCode).json({ error: customError.msg })
}

// const { CustomAPIError } = require('../errors')
// const { StatusCodes } = require('http-status-codes')
// const errorHandlerMiddleware = (err, req, res, next) => {
//   if (err instanceof CustomAPIError) {
//     return res.status(err.statusCode).json({ msg: err.message })
//   }
//   return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
// }

module.exports = errorHandlerMiddleware
