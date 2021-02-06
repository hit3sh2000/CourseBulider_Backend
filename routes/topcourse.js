
const express = require("express");
const mongoose = require('mongoose');
const Topcourses = mongoose.model('Topcourses');
const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const id = "601d9b3a281e143c348f98c7";
        const cid = req.body.cid;
        const topcourses = await Topcourses.findById(id);
        topcourses.courses.push(cid)
        console.log(topcourses);
        

        topcourses.save();
        res.json(topcourses);


    } catch (error) {
        console.log(error);
        res.json(error)
    }
});
router.get("/", async (req, res) => {
    try {
        const id = "601d9b3a281e143c348f98c7";
        const topcourses = await Topcourses.findById(id).populate("courses");
        res.json(topcourses.courses)

    } catch (error) {
        console.log(error);
        res.json(error)
    }
});
module.exports = router;