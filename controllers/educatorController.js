const mongoose = require('mongoose');
const Educator = mongoose.model('Educator');
module.exports = {
    addeducator:async(req, res) => {
        
        try{          
            const { E_name, E_experience, E_age, E_qualification}= req.body

            const educator = new Educator(); 
            educator.E_name = E_name
            educator.E_experience = E_experience
            educator.E_age = E_age
            educator.E_qualification = E_qualification
            await educator.save((err, doc) => {
                if (!err)
                    res.json(educator)
                else {
                     console.log(err);
                }
            });      
        }catch(err){
        res.send(err)
        }
    }, 
    geteducator: async(req, res) => {
        try{
            const educator = await Educator.find();
            res.send(educator);
        }catch(err){
        res.send(err)
        }
    },
    university_educator_course: async(req, res) => {
        try{
           

        }catch(err){
        res.send(err)
        }
    }
}