const mongoose = require('mongoose');  //importing mongoose
const bcrypt = require('bcrypt');       //importing bcrypt

//userSchema for user
var userSchema = new mongoose.Schema({
  U_firstname: {
    type: String,
    required: true,
    lowercase: true
  },
  U_lastname: {
    type: String,
    required: true,
    lowercase: true
  },
  U_username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  U_email: {
    type: String,
    required: true,
    lowercase: true
  },
  U_password: String,
  U_avatar: String,
  U_qualification: String,
  U_age: Number,
  U_contact: Number,
  U_address: String,
  U_gender: {
    type: String,
    enum: ['men', 'women'],
    required: false,
    default: 'men'
  },
  courses: [
    {
      course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University'
      },
    }
  ]


});


userSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(this.U_password, salt)
    this.U_password = hashPassword
    next()
  } catch (err) {
    console.log(err)
  }
})


module.exports = mongoose.model('User', userSchema); //exporting schema
