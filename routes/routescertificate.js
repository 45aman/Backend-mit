const express = require('express')
const router = express.Router()
const Certificate = require('../models/CertificatesModels')

router.post('/Certificates', async(request, response) => {
    const certificate = new Certificate({
        prn: request.body.prn,
        trino: request.body.trino,
        reason: request.body.reason
    })
    certificate.save()
        .then(data => {
            response.json(data)
        })
        .catch(error => {
            response.json(error)
        })
})

router.get('/getcertificate', async(req, res)=>{
    try {
        const certidata = await Certificate.find();
        res.status(201).json(certidata)
        console.log(certidata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

module.exports = router