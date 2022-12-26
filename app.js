require('dotenv').config()
require('express-async-errors')

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const xss = require('xss-clean')
const cors = require('cors')

//Swagger
const swagger = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')

const express = require('express')
const app = express()

//Authentication Middleware
const authMiddleware = require('./middleware/authentication')

//routes
const jobsRouter = require('./routes/jobs')
const authRouter = require('./routes/auth')

//connect DB
const connectDB = require('./db/connect')

// error handler
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')

app.set('trust proxy', 1)
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
)
app.use(xss())
app.use(helmet())
app.use(cors())
app.use(express.json())
// extra packages

// routes
app.use('/api/v1/jobs', authMiddleware, jobsRouter)
app.use('/api/v1/auth', authRouter)

app.get('/', (req, res) => {
  res.send('<h1>API Documentation</h1><a href="/api-docs">Docementation</a>')
})
app.use('/api-docs', swagger.serve, swagger.setup(swaggerDocument))
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    )
  } catch (error) {
    console.log(error)
  }
}

start()
