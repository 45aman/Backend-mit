const mongoose = require('mongoose')

const DupGCTemplate = new mongoose.Schema({
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
    reason:{
        type:String,
        required:true
    },
    trino:{
        type:String,
        required:true
    },
    rob:{
        type:String,
        required:true
    },
    year:{
        type:String,
        required:true
    },
    gpa:{
        type:String,
        required:true
    },
    fir:{
        type:String,
        required:true
    },
    affidavite:{
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

module.exports = mongoose.model('dupgcs', DupGCTemplate)