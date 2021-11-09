const mongoose = require("mongoose");
module.exports=async () =>{
    await mongoose.connect(process.env.DBurl,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });

    return mongoose;
}
