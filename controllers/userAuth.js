const load = require('dotenv').config();
if(load.error) throw load.error;
const jwt = require('jsonwebtoken');

 exports.giveToken=(req, res, next)=> {
    const payload = {
        username: req.user.U_username,
        firstname:req.user.U_firstname,
        lastname:req.user.U_lastname,
        id: req.user._id,
        gender:req.user.U_gender,
        address:req.user.U_address,
        contact:req.user.U_contact
    }
    const encoded = jwt.sign(payload, process.env.JWT_SECRET)
    res.cookie('username', req.user.username,  {httpOnly: true, sameSite: true, signed: true, path: "/"})
    res.cookie('id', req.user.id,  {httpOnly: true, sameSite: true, signed: true, path: "/"})
    res.cookie('token', encoded,  {httpOnly: true, sameSite: true, signed: true, path: "/"})
    
    res.send('Nicely done! You are In.')   
    
}
