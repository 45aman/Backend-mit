const express = require('express')
const router = express.Router()
const DupGC = require('../models/DupGCModels')
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');



const CLIENT_ID = '565242842065-4s2bftfd2b5k0c2adu5oangghhirkhgv.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04QecpYSyXG9QCgYIARAAGAQSNwF-L9IrKinECicEdQRWXSBCr4_0GbNKauG8O6nRTPI-q47VFI5hB4us-CbwKDkn7pLAmj-X2ig'
const ACCESSTOKEN = 'ya29.a0ARrdaM98vSUIPsf8ZFnsSfOGYIYfQVWlXBb7yLUVvRo7xH1BXhgkSeiD1zO4b7c-n9X8NwYinbeuKFZSeJqA1WQ2LiwPFLvw1PxLjTvkOzs0B2PpEAvDqXdvJsMl4r5t_tT9MBD69egpn9QYE9jqv6OC-2zI'


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


router.post('/DupGC', async (request, response) => {
    const dupgc = new DupGC({
        prn:request.body.prn,
        mob:request.body.mob,
        email:request.body.email,
        reason:request.body.reason,
        trino:request.body.trino,
        rob:request.body.rob,
        year:request.body.year,
        gpa:request.body.gpa,
        fir:request.body.fir,
        affidavite:request.body.affidavite
    }) 
    dupgc.save()
    .then(data =>{
        response. json(data)
    })    
    .catch(error =>{
        response. json(error)
    })   
})

router.get('/getDupGC', async(req, res) => {
    try {
        const DupGCdata = await DupGC.find();
        res.status(201).json(DupGCdata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

router.post("/updateDupGC", async(req, res) => {


    const { _id, prn, trino, reason,rob,gpa,year, fir, affidavite, date, status, msg } = req.body
    console.log(msg);

    const newdata = new DupGC({
        _id,
        prn,
        reason,
        trino,
        rob,
        year,
        gpa,
        date,
        status,
        msg,
        fir,
        affidavite

    })
    const DupGCdata = await DupGC.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(DupGCdata)
    //console.log(DupGCdata)

    //console.log(DupGCdata.gmail);

    const gmail = DupGCdata.email;

    const reply = DupGCdata.msg;
    //console.log(DupGCdata.msg);

    const e = DupGCdata.status;
    //console.log(e);


    const Msg = newdata.msg





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
                html: Msg, // html body
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