const router = require('express').Router()
const {createMaison, deleteMaison, louerMaison, editMaison, arreteLocation, getAllMaison, validate } = require('../controllers/maison')
const verifyJwt = require('../middlewares/verifyJwt')
/*
@create maison
@delete maison
@edit maison
@louer maison
@arreter location
*/
router.route('/').get(getAllMaison)
router.route('/create')
                .post(verifyJwt,createMaison)
router.route('/delete')
                .post(verifyJwt,deleteMaison)
router.route('/edit')
                .post(verifyJwt,editMaison)
router.route('/louer')
                .post(verifyJwt,louerMaison)
router.route('/stop')
                .post(verifyJwt,arreteLocation) 
router.route('/validate')
                .post(verifyJwt,validate) 

module.exports = router