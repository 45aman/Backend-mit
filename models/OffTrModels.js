const mongoose = require('mongoose')

const OffTrTemplate = new mongoose.Schema({
    prn:{
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
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('offtrs', OffTrTemplate)