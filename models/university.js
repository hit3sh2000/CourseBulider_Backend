const mongoose = require("mongoose"); //importing mongoose
const bcrypt = require('bcrypt');       //importing bcrypt


//universitySchema for user
var universitySchema = new mongoose.Schema({                    
  Us_name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,                 
  },
  Us_email: {
    type: String,
    require: true,
    unique: true,
  },
  Us_password:{
     type:String,
     require:true
  },
  Us_desc:String,
  Us_img: String,
  Us_ratings: String,
  Us_address:String,
  Us_role:String,

  schedule:[
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }
  ],

  courses: [
    {
      course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        require:true
      },
      Educator:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Educator",
        require:true
      }
    },
  ],
});


universitySchema.pre('save', async function(next){
  try{
      const salt = await bcrypt.genSalt(10)
      const hashPassword = await bcrypt.hash(this.Us_password, salt)
      this.Us_password= hashPassword
      next()
  }catch(err){
      console.log(err)
  }
})

module.exports=mongoose.model("University", universitySchema); //exporting schema
