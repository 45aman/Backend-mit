const mongoose = require('mongoose')

const OQTemplate = new mongoose.Schema({
    prn:{
        type:String,
        required:true
    },
    mob:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    query:{
        type:String,
        required:true
    },
    date:{
        type:String,
        default:Date.now
    },
    status: {
        type: String,
        default: "UNCHECK"
        
    },
    msg: {
        type: String,
        default: ""
        
    }
})

module.exports = mongoose.model('oqs', OQTemplate)