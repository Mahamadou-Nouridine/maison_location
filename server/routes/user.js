const router = require('express').Router()
const {createUser} = require('../controllers/user')

router.route('/new')
        .post(createUser)

module.exports = router