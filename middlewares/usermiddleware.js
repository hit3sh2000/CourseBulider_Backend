const jwt=require('jsonwebtoken');
const load = require("dotenv").config();
if (load.error) throw load.error;

exports.requireSignin=(req,res,next)=>{
    const token=req.header('x-auth');
    if(!token) res.status(401).json({msg:"no token founds"})
    try {
        const decode=jwt.verify(token,process.env.JWT_SECRET);
        req.user=decode;
    } catch (error) {
        
    }
    next();
}
exports.universityMiddleware = (req, res, next) => {
    if (req.user.role !== "university") {
      return res.status(400).json({ message: "University access denied" });
    }
    next();
  };
  
//   exports.adminMiddleware = (req, res, next) => {
//     if (req.user.role !== "admin") {
//       if (req.user.role !== "super-admin") {
//         return res.status(400).json({ message: "Admin access denied" });
//       }
//     }
//     next();
//   };