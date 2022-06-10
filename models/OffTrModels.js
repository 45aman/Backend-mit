const mongoose = require('mongoose')

const OffTrTemplate = new mongoose.Schema({
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
    reqCopies:{
        type:String,
        required:true
    },
    collectingOption:{
        type:String,
        required:true
    },
    address:{
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

module.exports = mongoose.model('offtrs', OffTrTemplate)