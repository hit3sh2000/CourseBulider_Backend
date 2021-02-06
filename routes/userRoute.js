const express = require('express'); //importing express
var router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const userController = require('../controllers/userController')
require('dotenv').config();
const upload = require('../middlewares/multer');
const {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../middlewares/jwt_helper');
router.route('/')
.get(userController.getUser)//to get all user
.post(upload.single('U_avatar'),userController.addUser)//to add user

router.post('/edit',userController.Edit)

router.post('/id',async(req,res)=>{
    try {
        const id = req.body.id;
        const user = await User.findById(id);
        res.json(user);
    } catch (err) {
        res.send(err)
    }
})

//to login user
router.post('/login', userController.Login )

router.post('/userAllDetails',userController.userAllDetails)

module.exports = router;
