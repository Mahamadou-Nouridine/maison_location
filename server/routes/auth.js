const router = require('express').Router()
const { login, refresh, logout } = require('../controllers/auth')

router.route('/')
    .post(login)

router.route('/refresh')
    .get(refresh)

router.route('/logout')
    .get(logout)

module.exports = router