const mongoose = require("mongoose");

module.exports=async () =>{
    await mongoose.connect('mongodb+srv://Prateek:Dontaskagain12@blog.wvc6r.mongodb.net/Blog?retryWrites=true&w=majority',{
        useNewUrlParser : true,
        useUnifiedTopology : true
    });

    return mongoose;
}
