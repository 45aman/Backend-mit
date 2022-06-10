const mongoose = require('mongoose')

const ConGCTemplate = new mongoose.Schema({
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
    trino:{
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

module.exports = mongoose.model('congcs', ConGCTemplate)