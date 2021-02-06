const mongoose = require("mongoose");
const educatorSchema = new mongoose.Schema({

    E_name: {
      type: String,
      required: true,
    },
    E_experience: {
      type: String,
      required: true,
    },
    E_age: {
      type: String,
      required: true,
    },
    E_qualification: {
      type: String,
      required: true,
    }

});

module.exports = mongoose.model("Educator", educatorSchema);