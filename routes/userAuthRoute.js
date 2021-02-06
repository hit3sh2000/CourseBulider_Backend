const express = require('express'); //importing express
var router = express.Router();
const passport=require('../middlewares/passport');
const {giveToken}=require('../controllers/userAuth')
require('dotenv').config();
const upload = require('../middlewares/multer');


router.use(passport.initialize());

router.post('/',passport.authenticate("local", { session: false, failureMessage:true}),giveToken)

module.exports = router;
