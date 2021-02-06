const express = require('express'); //importing express
var router = express.Router();
const mongoose = require('mongoose');
const Schedule = mongoose.model('Schedule');
const Course = mongoose.model('Course');

const scheduleController = require('../controllers/scheduleController')


router.route('/')
    .get(scheduleController.getSchedule)
    .post(scheduleController.addSchedule)

router.get('/:uid/:cid', async (req, res) => {
    try {
        const uid = req.params.uid;
        const cid = req.params.cid;
        const temp = {
            university: uid,
            course: cid
        }

        const courseByid  = await Course.findById(cid);
        const getschedule = await Schedule.find();
        const result = [];
        // if(getschedule.universitys_course)
        getschedule.map((item,index)=>{
            if(item.universitys_course.university == uid && item.universitys_course.course == cid){
                result.push(item);
            }
        })

        res.json({result,course:courseByid});

    } catch (error) {

    }
})

module.exports = router;
