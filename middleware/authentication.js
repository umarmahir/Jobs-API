const jwt = require('jsonwebtoken')
const authMiddleware = async (req, res, next) => {
  const auth = req.headers.authorization
  const token = auth.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const { name, userId } = decoded
    req.user = { name, userId }
    next()
  } catch (error) {
    console.log(error)
    error.message = 'Unauthorized to access this route'
    error.status = 401
    throw error
  }
}

module.exports = authMiddleware
