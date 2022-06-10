const express = require('express')
const router = express.Router()
const Certificate = require('../models/CertificatesModels')
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');


const CLIENT_ID = "565242842065-4s2bftfd2b5k0c2adu5oangghhirkhgv.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URL = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04c7kJviy7JpeCgYIARAAGAQSNwF-L9IrH8OAM5OG1GlbHgnkJp_eYUWL07J56XZzZhn4azbUmx1UIIbybW8U9Wm9WnajaAO1vvo"


const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })
 


router.post('/Certificates', async(request, response) => {
    const certificate = new Certificate({
        prn: request.body.prn,
        mobileno: request.body.mobileno,
        gmail: request.body.gmail,
        trino: request.body.trino,
        reason: request.body.reason,
    })
    certificate.save()
        .then(data => {
            response.json(data)
        })
        .catch(error => {
            response.json(error)
        })
})

router.get('/getcertificate', async(req, res) => {
    try {
        const certidata = await Certificate.find();
        res.status(201).json(certidata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }

})

router.post("/updateCerti", async(req, res) => {


    const { _id, prn, trino, reason, date, status, remark, msg } = req.body
    console.log(msg);

    const newdata = new Certificate({
        _id,
        prn,
        trino,
        reason,
        date,
        status,
        remark,
        msg

    })


   const Status = newdata.status

   console.log(Status);


   const certidata = await Certificate.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(certidata)
    //console.log(certidata)

    //console.log(certidata.gmail);

    const gmail = certidata.gmail;

    const reply = certidata.msg;
    //console.log(certidata.msg);

    const e = certidata.status;
    //console.log(e);


    const Msg = newdata.msg





    console.log(Msg);

   if (Status == "PENDING" || Status == "COMPLETED"){
    




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
       
   } else {

   }
  




})

module.exports = router