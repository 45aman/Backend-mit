const express = require('express')
const router = express.Router()
const EquC = require('../models/EquCModels')
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');



const CLIENT_ID = '565242842065-4s2bftfd2b5k0c2adu5oangghhirkhgv.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04QecpYSyXG9QCgYIARAAGAQSNwF-L9IrKinECicEdQRWXSBCr4_0GbNKauG8O6nRTPI-q47VFI5hB4us-CbwKDkn7pLAmj-X2ig'
const ACCESSTOKEN = 'ya29.A0ARrdaM_8RDj3iJd42dEJTUbPy-F5qgffu8xkA93XXYiTnn7jNaiEsjD0L0T_i1EEcAMpLyUAOB2gsyoXxopQumQ0W7QsMmiwEouRojRor36zofFOG4RnvU5JB20CGHj5UO_xyqDAWYATfW66DJst2ehtyQjZNQ'




const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })



router.post('/EquC', async (request, response) => {
    const equc = new EquC({
        prn:request.body.prn,
        mob:request.body.mob,
        email:request.body.email,
        year:request.body.year,
        gpa:request.body.gpa,
        reason:request.body.reason
    }) 
    equc.save()
    .then(data =>{
        response. json(data)
    })    
    .catch(error =>{
        response. json(error)
    })   
})


router.get('/getEquC', async(req, res) => {
    try {
        const EquCdata = await EquC.find();
        res.status(201).json(EquCdata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

router.post("/updateEquC", async(req, res) => {


    const { _id, prn, year,gpa, reason, date, status, msg } = req.body

    const newdata = new EquC({
        _id,
        prn,
        year,
        gpa,
        reason,
        date,
        status,
        msg

    })
    const EquCdata = await EquC.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(EquCdata)
    console.log(EquCdata)


    const gmail = EquCdata.email;
    console.log(gmail);

    const Msg = newdata.msg;
    console.log(Msg);







    async function sendMail() {
        try {
            const accessToken = await oAuth2Client.getAccessToken()
            const token = accessToken.token;

            const transport = nodemailer.createTransport({

                service: 'gmail',

                auth: {
                    type: 'OAuth2',
                    user: '45amanshaikh@gmail.com',
                    clientId: CLIENT_ID,
                    clientSecret: CLIENT_SECRET,
                    refresh_token: REFRESH_TOKEN,
                    accessToken: token
                },
            });
            const mailOptions = {
                from: "<45amanshaikh@gmail.com>", // sender address
                to: gmail, // list of receivers
                subject: "Exam Department", // Subject line
                text: Msg, // plain text body
            };

            const result = await transport.sendMail(mailOptions)
            return result

        } catch (error) {
            return error
        }

    }
    sendMail()
        .then(result => console.log('Email sent...', result))
        .catch((error) => console.log(error.message));




})

module.exports = router