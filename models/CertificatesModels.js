const mongoose = require('mongoose')

const CertificatesTemplate = new mongoose.Schema({
    prn: {
        type: String,
        required: true
    },
    mobileno: {
        type: String,
        required: true
    },
    gmail: {
        type: String,
        required: true
    },
    trino: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    date: {
        
        default: Date.now(),
        type : String
    },
    status: {
        type: String,
        default: "UNCHECK"
        
    },
    msg: {
        type: String,
        default: ""
        
    },
    remark: {
        type: String,
        default: ""
        
    }
})

const Certificate = new mongoose.model('Certificate', CertificatesTemplate)

module.exports = Certificate