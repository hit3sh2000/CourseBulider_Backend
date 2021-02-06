require('dotenv').config();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const upload = require('../middlewares/multer');
const cloudinary = require('cloudinary');
require('../middlewares/cloudinary');
const bcrypt = require("bcrypt");
const Cart = mongoose.model('Cart');
const {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
} = require('../middlewares/jwt_helper');


module.exports = {
    addUser: async (req, res) => {
        try {
            // const path ="user/avatar/" + req.file.filename;
            // const img = await cloudinary.v2.uploader.upload(req.file.path,
            //     { public_id: path });
            const fileStr = req.body.avatar;
            const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
                upload_preset: 'ml_default',
            });

            const {
                U_firstname, U_lastname,
                U_username, U_email,
                U_password, U_qualification,
                U_age, U_gender, U_contact, U_address, avatar
            } = req.body;

            const user = new User();
            user.U_firstname = U_firstname
            user.U_lastname = U_lastname
            user.U_username = U_username
            user.U_email = U_email
            user.U_password = U_password
            user.U_avatar = uploadResponse.secure_url
            user.U_qualification = U_qualification
            user.U_age = U_age
            user.U_gender = U_gender
            user.U_contact = U_contact
            user.U_address = U_address

            await user.save();

            const user1 = await User.findOne({ U_username: U_username });
            const cart = new Cart();
            cart.user = user1._id
            await cart.save()
            res.json({ user, cart })

        } catch (err) {
            res.send(err)
            console.log(err);
        }
    },
    getUser: async (req, res) => {
        try {
            const user = await User.find();
            res.send(user);
        } catch (err) {
            res.send(err)
        }
    },
    userAllDetails: async (req, res) => {
        try {
            const id = req.body.id;
            const user = await User.findById(id).populate('courses.course').populate('courses.university');
            res.json(user);
        } catch (err) {
            res.json(err)
        }
    },
    Login: async (req, res) => {

        try {
            var un = req.body.username
            var password = req.body.password

            const user = await User.findOne({
                U_username: un
            })
            if (user == null) {
                return res.status(400).send('cannot find user')
            }
            const checkpassword = await bcrypt.compare(password, user.U_password);
            if (checkpassword) {
                const accessToken = await signAccessToken(user.id)

                res.json({ auth: true, token: accessToken, result: user })

            } else {
                res.json({ auth: false, message: "Not allowed" })
            }
        } catch (err) {
            res.json({ auth: false, err, message: "Not allowed" })
        }
    },
    Edit: async (req, res) => {
        try {
            const fileStr = req.body.avatar;
            const uploadResponse = await cloudinary.v2.uploader.upload(fileStr, {
                upload_preset: 'ml_default',
            });

            const { id, U_firstname, U_lastname, U_qualification,
                U_age, U_gender, U_contact, U_address } = req.body;

            const user = await User.findById(id);
            user.U_firstname = U_firstname
            user.U_lastname = U_lastname
            user.U_qualification = U_qualification
            user.U_age = U_age
            user.U_avatar = uploadResponse.secure_url
            user.U_gender = U_gender
            user.U_contact = U_contact
            user.U_address = U_address
            console.log(user);
            user.save()
            res.json(user)
        } catch (err) {
            res.send(err)
        }
    },
}