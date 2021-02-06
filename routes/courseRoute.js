const express = require('express'); //importing express
var router = express.Router();
const courseController = require('../controllers/courseController')
require('dotenv').config();
const upload = require('../middlewares/multer');
const { requireSignin, universityMiddleware } = require('../middlewares/usermiddleware')


router.route('/')
    .get(courseController.getCourse)//to get all user
    .post(upload.single('C_img'), courseController.addCourse)//to add user
// .post(requireSignin,universityMiddleware, upload.single('C_img'), courseController.addCourse)//to add user

router.route('/:id')
    .get(courseController.fetchUniversityCourse)


router.post('/university/:uid',courseController.byUniversity)


module.exports = router;
