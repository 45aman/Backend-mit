const express = require('express')
const { logging_v2 } = require('googleapis')
const router = express.Router()
const multer = require('multer')
const upload = multer({dest: '../uploads/'})
const TriToSem = require('../models/TriToSemModels')
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');


const CLIENT_ID = '565242842065-4s2bftfd2b5k0c2adu5oangghhirkhgv.apps.googleusercontent.com'
const CLIENT_SECRET = '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'
const REDIRECT_URI = 'https://developers.google.com/oauthplayground'
const REFRESH_TOKEN = '1//04QecpYSyXG9QCgYIARAAGAQSNwF-L9IrKinECicEdQRWXSBCr4_0GbNKauG8O6nRTPI-q47VFI5hB4us-CbwKDkn7pLAmj-X2ig'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })


 
router.post('/tritosem', async (request, response) => {
    
    const tritosem = new TriToSem({
        prn:request.body.prn,
        mob:request.body.mob,
        email:request.body.email,
        image:request.body.image
    
    }) 
    console.log(tritosem);

    tritosem.save()
    .then(data =>{
        response. json(data)
    })    
    .catch(error =>{
        response. json(error)
    })   
})

router.get('/getTriToSem', async(req, res) => {
    try {
        const TriToSemdata = await TriToSem.find();
        res.status(201).json(TriToSemdata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

router.post("/updateTriToSem", async(req, res) => {


    const { _id, prn,  image, date, status, msg } = req.body

    const newdata = new TriToSem({
        _id,
        prn,
        image,
        date,
        status, 
        msg

    })
    const TriToSemdata = await TriToSem.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(TriToSemdata)
    console.log(TriToSemdata)

    console.log(TriToSemdata.gmail);

    const gmail = TriToSemdata.email;

const Msg = newdata.msg    




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