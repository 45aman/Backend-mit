const mongoose = require('mongoose')

const CertificatesTemplate = new mongoose.Schema({
    prn: {
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
        type: Date,
        default: Date.now
    }
})

const Certificate = new mongoose.model('Certificate', CertificatesTemplate)

module.exports = Certificate