const mongoose = require('mongoose');
const url = 'mongodb+srv://root:EVAWbbrdED7S2rgz@cluster0.o2dqv.mongodb.net/coursebuilder?retryWrites=true&w=majority'
//this is for connnecting MongoDB
mongoose.connect(url, { 
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
}, (err) => {
    if (!err) { console.log('MongoDB Connection Succeeded.') }
    else { console.log('Error in DB connection : ' + err) }
});

require('./user');         // requiring Schema                                      
require('./course');       // requiring Schema                                               
require('./university');   // requiring Schema                                                  
require('./schedule')      // requiring Schema              
require('./cart')          // requiring Schema                                                          
require('./educator')          // requiring Schema                                                          
require('./topcourse')          // requiring Schema                                                          