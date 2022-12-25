const express = require('express')
const router = express.Router()

const { login, register, getUsers } = require('../controllers/auth')

router.route('/login').post(login)
router.route('/register').post(register).get(getUsers)

module.exports = router
