const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const University=require('../models/university')

exports.singIn=async(req,res)=>{
   const {email,password}=req.body;
   try {
    const user=await University.findOne({Us_email:email});
    if(user){
        const checkpassword = await bcrypt.compare(password, user.Us_password);
        if(!checkpassword){
           res.status(500).json({msg:"password incorrect"})
        }
        const payload={
            id:user._id,
            name:user.Us_name,
            email:user.Us_email,
            desc:user.Us_desc,
            address:user.Us_address,
            courses:user.Us_courses,
            role:user.Us_role
        }
        console.log(payload);
        const token=await jwt.sign(payload,process.env.JWT_SECRET)
        res.send(token)
    }
   } catch (error) {
       res.status(500).send(error)
   }
  
}