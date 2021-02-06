const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Course = mongoose.model('Course');
const University = mongoose.model('University');
require('dotenv').config();
const upload = require('../middlewares/multer');
const cloudinary = require('cloudinary');
const {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../middlewares/jwt_helper');
require('../middlewares/cloudinary');
module.exports = {
    adduniversity: async (req, res) => {
        try {
            const fileStr = req.body.avatar;
            const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
                upload_preset: 'ml_default',
            });
            const {
                Us_name, Us_email, Us_password, Us_desc, Us_ratings, Us_address
            } = req.body;

            const university = new University();
            university.Us_name = Us_name
            university.Us_email = Us_email
            university.Us_password = Us_password
            university.Us_desc = Us_desc
            university.Us_img = uploadResponse.secure_url
            university.Us_ratings = Us_ratings
            university.Us_address = Us_address
            university.Us_role = "university"
            await university.save((err, doc) => {
                if (!err)
                    res.json(university)
                else {
                    console.log(err);
                }
            });
        } catch (err) {
            res.send(err)
            console.log(err);
        }
    },
    getuniversity: async (req, res) => {
        try {
            const university = await University.find();
            res.send(university);

        } catch (err) {
            res.send(err)
        }
    },
    getuniversity_course: async (req, res) => {
        try {
            const university = await University.findById(req.body.id).populate('courses');
            res.send(university.courses);
        } catch (err) {
            res.send(err)
        }
    },
    Login: async (req, res) => {
        try {
            var email = req.body.email
            var password = req.body.password

            const university = await University.findOne({
                Us_email: email
            })
            if (university == null) {
                return res.status(400).send('cannot find university')
            }
            console.log(university);
            const checkpassword = await bcrypt.compare(password, university.Us_password);
            console.log(checkpassword);
            if (checkpassword) {
                const accessToken = await signAccessToken(university._id)
                res.json({ auth: true, token: accessToken, result: university })
            } else {
                res.json({ auth: false, message: "Not allowed" })
            }
        } catch (err) {
            res.send(err)
        }
    },
    Getid: async (req, res) => {
        try {
            const id = req.body.id;
            const university = await University.findById(id).populate('courses.course').populate('courses.Educator')
            res.json(university)
        } catch (err) {
            res.send(err)
        }
    },
    Update: async (req, res) => {
        try {
            const fileStr = req.body.avatar;
            const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
                upload_preset: 'ml_default',
            });

            const { id,Us_name,  Us_desc, Us_ratings, Us_address } = req.body;
            console.log(id,Us_name, Us_desc, Us_ratings, Us_address);
            const university = await University.findById(id);
            university.Us_name = Us_name
            university.Us_desc = Us_desc
            university.Us_img = uploadResponse.secure_url
            university.Us_ratings = Us_ratings
            university.Us_address = Us_address
            university.save()

            res.json(university)
            
        } catch (err) {
            res.send(err)
        }
    },
    adduniversity_course: async (req, res) => {
        try {
            let temp = 0
            const UniversityId = req.body.id;
            const CourseId = req.body.cid;
            const EducatorId = req.body.eid;
            const university = await University.findById(UniversityId)
            university.courses.map(item => {
                if (item.course == CourseId) {
                    temp = 1;
                } 
            })
            if (temp == 0) {
                const course = await Course.findById(CourseId)
                if (course && university) {
                    course.Universities.push(UniversityId)
                    university.courses.push({ course: CourseId, Educator: EducatorId })
                    await course.save();
                    await university.save((err, doc) => {
                        if (!err)
                            res.json({ university, course })
                        else {
                            console.log(err);
                        }
                    });
                }
            }else{
                res.json({message:"university has this course already "})
            }
        } catch (err) {
            res.send(err)
        }
    }
}