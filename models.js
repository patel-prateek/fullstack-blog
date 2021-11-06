const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
    title : {
        type: String,
        required : true
    },
    author : {
        type: String,
        required : true
    },
    des:  {
        type: String,
        required : true
    },
    date : {
        type:Date,
        default : Date.now
    }
})

module.exports = mongoose.model('blogModel',blogSchema);