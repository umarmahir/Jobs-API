const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const bcrypt = require('bcryptjs')

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    const newError = new Error('Please provide credentials')
    newError.status = 400
    throw newError
  }

  const user = await User.findOne({ email })
  if (!user) {
    const newError = new Error('no such user!')
    newError.status = 404
    throw newError
  }

  const match = await user.comparePassword(password)
  if (!match) {
    const newError = new Error('Incorrect email/password')
    newError.status = 401
    throw newError
  }

  const token = user.createToken()
  res.status(StatusCodes.OK).json({ name: user.name, token })
}

const register = async (req, res) => {
  const user = await User.create({ ...req.body })
  const token = user.createToken()
  res.status(StatusCodes.CREATED).json({ user, token })
}

const getUsers = async (req, res) => {
  const users = await User.find({})
  res.status(StatusCodes.OK).json({ users })
}

module.exports = { login, register, getUsers }
