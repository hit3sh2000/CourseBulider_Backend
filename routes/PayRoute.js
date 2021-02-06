const express = require("express");
const payController = require("../controllers/payController");
const router = express.Router();

router.post("/",payController.pay);
router.post("/bill",payController.bill);
// router.get("/", payController.);





module.exports = router;