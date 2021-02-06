const express = require('express'); //importing express
var router = express.Router();
const universityController = require('../controllers/universityController')
require('dotenv').config();
const upload = require('../middlewares/multer');
const{singIn}=require('../controllers/universityAuth')

// to add and get all university
router.route('/')
.get(universityController.getuniversity)//to get all user
.post(upload.single('Us_img'),universityController.adduniversity)//to add user
router.post('/auth',singIn);

//to all course in university
router.route('/addcourse')
.get(universityController.getuniversity_course)
.post(universityController.adduniversity_course)

router.post('/getid',universityController.Getid)

router.post('/login',universityController.Login)
router.post('/update',universityController.Update)

module.exports = router;
