const mongoose = require("mongoose");
const scheduleSchema = new mongoose.Schema({
    
    S_topic: {
        type: String
      },
    S_date: {
        type: String
      },
    S_time: {
        type: String
      },
    S_link: {
        type: String
      },
    universitys_course:{
      university:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "University"
      },
      course:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    }
});

mongoose.model("Schedule",scheduleSchema);