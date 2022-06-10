const express = require('express')
const router = express.Router()
const ConGC = require('../models/ConGCModels')
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');


const CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URL = process.env.GOOGLE_REDIRECT_URL
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN
const ACCESSTOKEN = 'ya29.A0ARrdaM_8RDj3iJd42dEJTUbPy-F5qgffu8xkA93XXYiTnn7jNaiEsjD0L0T_i1EEcAMpLyUAOB2gsyoXxopQumQ0W7QsMmiwEouRojRor36zofFOG4RnvU5JB20CGHj5UO_xyqDAWYATfW66DJst2ehtyQjZNQ'




const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

router.post('/ConGC', async (request, response) => {
    const congc = new ConGC({
        prn:request.body.prn,
        mob:request.body.mob,
        email:request.body.email,
        trino:request.body.trino
    }) 
    congc.save()
    .then(data =>{
        response. json(data)
    })    
    .catch(error =>{
        response. json(error)
    })   
})

router.get('/getConGC', async(req, res) => {
    try {
        const ConGCData = await ConGC.find();
        res.status(201).json(ConGCData)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

router.post("/updateConGC", async(req, res) => {


    const { _id, prn, trino,  date, status, msg } = req.body

    const newdata = new ConGC({
        _id,
        prn,
        trino,
        date,
        status,
        msg

    })
    const ConGCData = await ConGC.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(ConGCData)
    console.log(ConGCData)


    const gmail = ConGCData.email;

    const Msg = newdata.msg;



    



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