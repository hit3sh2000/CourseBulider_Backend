
const express = require("express");
const {
  addCourseInCart,
  getCourseInCart,
  cartItems,
  removeCourseInCart
} = require("../controllers/cartController");
const router = express.Router();
const{requireSignin}=require('../middlewares/usermiddleware')

router.post("/add",addCourseInCart);
router.post("/remove",removeCourseInCart);
router.get("/", getCourseInCart);
router.get("/cartItems/:id", cartItems);


module.exports = router;