// const shortid = require("shortid");
// const path = require("path");                          commented because it not used 
// require('dotenv').config();
// const upload = require('../middlewares/multer');

const express = require("express");
const {
  addCategory,
  getCategories,
  updateCategories,
  deleteCategories,
  getCouresById,
  getUniversityByCourse,
  getFull
} = require("../controllers/category");
const router = express.Router();
const { requireSignin, universityMiddleware } = require('../middlewares/usermiddleware')
const { verifyAccessToken } = require('../middlewares/jwt_helper')

router.post("/create", addCategory);
router.get("/getcategory", getCategories);
router.put("/update", updateCategories);
router.delete("/delete", deleteCategories);

router.get("/:id", getCouresById)

router.get('/course/:cid', getUniversityByCourse)
router.get('/getFull/:cid/:uid', getFull)

module.exports = router;