const express = require('express')
const router = express.Router()
const OffTrTemplateCopy = require('../models/OffTrModels')

router.post('/OffTr', async (request, response) => {
    const OfficialTranscript = new OffTrTemplateCopy({
        prn:request.body.prn,
        reqCopies:request.body.reqCopies,
        collectingOption:request.body.collectingOption,
        address:request.body.address
    }) 
    OfficialTranscript.save()
    .then(data =>{
        response. json(data)
    })    
    .catch(error =>{
        response. json(error)
    })   
})

module.exports = router