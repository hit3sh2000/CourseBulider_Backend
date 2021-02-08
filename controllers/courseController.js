const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const University = mongoose.model('University');
const Educator = mongoose.model('Educator');
require('dotenv').config();
const slugify = require("slugify");
const shortid = require("shortid");
const cloudinary = require('cloudinary');
require('../middlewares/cloudinary');
module.exports = {
    addCourse: async (req, res) => {
        try {
            const path = "course/avatar/" + req.file.filename;
            const avatar = await cloudinary.v2.uploader.upload(req.file.path,
                { public_id: path });

            const {
                C_name, C_desc, C_ratings, C_reviews, C_duration, C_price, category
            } = req.body;

            const course = new Course();
            course.C_name = C_name
            course.C_slug = slugify(C_name)
            course.C_desc = C_desc
            course.C_img = avatar.url
            course.C_ratings = C_ratings
            course.C_reviews = C_reviews
            course.C_duration = C_duration
            course.C_price = C_price
            course.category = category

            await course.save((err, doc) => {
                if (!err)
                    res.json(course)
                else {
                    console.log(err);
                }
            });
        } catch (err) {
            res.json(err)
            console.log(err);
        }
    },
    getCourse: async (req, res) => {
        try {
            const course = await Course.find();
            res.json(course);
        } catch (err) {
            res.send(err)
        }
    },
    fetchUniversityCourse: async (req, res) => {
        try {
            const id = req.params.id;
            const course = await Course.findById(id).populate("Universities");
            // console.log(course.Universities);
            res.json(course.Universities);
        } catch (err) {
            res.send(err)
        }
    },
    byUniversity: async (req, res) => {
        try {
            const uid = req.params.uid;
            const {
                C_name, C_desc, C_ratings, C_reviews, C_duration, C_price, category,educatorinfo
            } = req.body;
            if (!await Course.findOne({ C_name })) {
                const fileStr = req.body.course_avatar;
                const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
                    upload_preset: 'ml_default',
                });
                const course = new Course();
                course.C_name = C_name
                course.C_slug = slugify(C_name)
                course.C_desc = C_desc
                course.C_img = uploadResponse.secure_url
                course.C_duration = C_duration
                course.C_price = C_price
                course.category = category
                course.save();
            }
            const university = await University.findById(uid);
            const course1 = await Course.findOne({ C_name })
            course1.Universities.push(uid)
            const educator = await Educator.findOne({ E_name:educatorinfo })
            const temp = {
                course: course1._id,
                Educator: educator._id
            }
            university.courses.push(temp)
            course1.save();
            university.save();
            res.json({course1,university})
        } catch (err) {
            res.send(err)
        }
    }
}
