const express = require('express')
const app = express()
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const mg = require('mailgun-js');
const routesCerti = require('./routes/routescertificate')
const routesOffTr = require('./routes/routesofftr')
const routesConGC = require('./routes/routesConGC')
const routesTriToSem = require('./routes/routesTriToSem')
const routesOQ = require('./routes/routesOQ')
const routesEquC = require('./routes/routesEquC')
const routesDupGC = require('./routes/routesDupGC')






const dotenv = require('dotenv')
const cors = require('cors')
const md5 = require('md5');
const DateOnly = require('mongoose-dateonly')(mongoose);
const nodemailer = require('nodemailer')
const { google } = require('googleapis');
const { log } = require('npmlog');

const Razorpay = require('razorpay')
const shortid = require('shortid')


const CLIENT_ID = "565242842065-4s2bftfd2b5k0c2adu5oangghhirkhgv.apps.googleusercontent.com"
const CLIENT_SECRET = "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"
const REDIRECT_URL = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN = "1//04c7kJviy7JpeCgYIARAAGAQSNwF-L9IrH8OAM5OG1GlbHgnkJp_eYUWL07J56XZzZhn4azbUmx1UIIbybW8U9Wm9WnajaAO1vvo"
//const ACCESSTOKEN = 'ya29.A0ARrdaM_8RDj3iJd42dEJTUbPy-F5qgffu8xkA93XXYiTnn7jNaiEsjD0L0T_i1EEcAMpLyUAOB2gsyoXxopQumQ0W7QsMmiwEouRojRor36zofFOG4RnvU5JB20CGHj5UO_xyqDAWYATfW66DJst2ehtyQjZNQ'

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })











app.use(express.json())
app.use(express.urlencoded())
app.use(cors())



dotenv.config()


//Payment
const razorpay = new Razorpay({ key_id: 'rzp_test_NCgVjDkvV1r7jm', key_secret: 'f4zHn6ocSmmvy5hMyVCHNQKM' })

app.post('/razorpay', async (req,res) => {

  const payment_capture = 1
  const amount = 200
  const currency = 'INR'
  
  const options = {
    amount: amount * 100,
    currency,
    receipt: shortid.generate() ,
    payment_capture 
  }  

  const response = await razorpay.orders.create(options)

  console.log(response)
  res.json({
    id : response.id,
    currency: response.currency,
    amount: response.amount
  })
})




const DB = process.env.DB

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected'))
    .catch(err => console.log(err))

const studentSchema = new mongoose.Schema({
    studentname: String,
    fathername: String,
    prn: Number,

    password: String,
    program: String,
    specialization: String,
    mobile: Number,
    email: String,
})


const Student = new mongoose.model("Student", studentSchema)

app.post("/loginstudent", (req, res) => {
    const { prn, password } = req.body

    Student.findOne({ prn: prn }, (err, student) => {
        if (student) {
            if (password === student.password) {
                res.send({ message: "Login Sucessfull", student: student })
            } else {
                res.send({ message: "Password didn't match" })
            }

        } else {
            res.send({ message: "Student not Registered" })
        }
    })
})


app.post("/register", (req, res) => {
    const { studentname, fathername, prn, password, program, specialization, mobile, email } = req.body
    Student.findOne({ prn: prn }, (err, student) => {
        if (student) {
            res.send({ message: "Student already registerd" })
        } else {
            const student = new Student({
                studentname,
                fathername,
                prn,
                password,
                program,
                specialization,
                mobile,
                email,

            })
            student.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered" })
                }
            })
        }
    })

})




app.get("/getstudent", async(req, res) => {
    try {
        const studata = await Student.find();
        res.status(201).json(studata)
       // console.log(studata)
    } catch (error) {
        res.status(422).json(error);
    }
})

app.get("/getstudent/:id", async(req, res) => {
    try {


        const { id } = req.params;

        const studentindividual = await Student.find({prn:id});
        //console.log(studentindividual);
        res.status(201).json(studentindividual)
    } catch (error) {
        res.status(422).json(error);
    }
})


app.post("/getdepartment", (req, res) => {
    const { specialization , subject, msg } = req.body

    const Sub = subject
    console.log(Sub);
    const Msg = msg
    console.log(Msg);

    Student.find({ specialization: specialization }, (err, students) => {
        if (students) {
            res.send({ message: "Student Department wise" })

            const Emails = students.map(function(student){return student.email;});

            console.log(Emails);


            const html = "<b>"+Msg+"</b>"
            console.log(html);

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
                        to: Emails, // list of receivers
                        subject: Sub, // Subject line
                        text: Msg, // plain text body
                        html: html, // html body
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

})



const staffSchema = new mongoose.Schema({
    staffname: String,
    sfprn: Number,
    sfpassword: String,
    designation: String,
    sfmobile: Number,
    sfemail: String,
})

staffSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["sfpassword"] })

const Staff = new mongoose.model("Staff", staffSchema)

app.post("/loginstaff", (req, res) => {
    const { sfprn, sfpassword } = req.body
    Staff.findOne({ sfprn: sfprn }, (err, staff) => {
        if (staff) {
            if (sfpassword === staff.sfpassword) {
                res.send({ message: "Login Sucessfull", staff: staff })
            } else {
                res.send({ message: "Password didn't match" })
            }

        } else {
            res.send({ message: "Staff not Registered" })
        }
    })
})


app.post("/registerstaff", (req, res) => {
    const { staffname, sfprn, sfpassword, designation, sfmobile, sfemail } = req.body
    Staff.findOne({ sfprn: sfprn }, (err, staff) => {
        if (staff) {
            res.send({ message: "Staff already registerd" })
        } else {
            const staff = new Staff({
                staffname,
                sfprn,
                sfpassword,
                designation,
                sfmobile,
                sfemail,

            })
            staff.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered" })
                }
            })
        }
    })

})


const adminSchema = new mongoose.Schema({
    adminname: String,
    adprn: Number,
    adpassword: String,
    designation: String,
    admobile: Number,
    ademail: String,
})

adminSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["adpassword"] })


const Admin = new mongoose.model("Admin", adminSchema)

app.post("/loginadmin", (req, res) => {
    const { adprn, adpassword } = req.body
    Admin.findOne({ adprn: adprn }, (err, admin) => {
        if (admin) {
            if (adpassword === admin.adpassword) {
                res.send({ message: "Login Sucessfull", admin: admin })
            } else {
                res.send({ message: "Password didn't match" })
            }

        } else {
            res.send({ message: "Staff not Registered" })
        }
    })
})


app.post("/registeradmin", (req, res) => {
    const { adminname, adprn, adpassword, designation, admobile, ademail } = req.body
    Admin.findOne({ adprn: adprn }, (err, admin) => {
        if (admin) {
            res.send({ message: "Admin already registerd" })
        } else {
            const admin = new Admin({
                adminname,
                adprn,
                adpassword,
                designation,
                admobile,
                ademail,

            })
            admin.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "Successfully Registered" })
                }
            })
        }
    })

})


const timetableSchema = new mongoose.Schema({
    department: String,
    year: String,
    trimester: String,
    program: String,
    type: String,
    date: String,
    ttfile: String,

})

const Timetable = new mongoose.model("Timetable", timetableSchema)

app.post("/timetableadd", (req, res) => {
    const { department,year, trimester,program, type, date, ttfile } = req.body



    Student.find({ program: department }, (err, students) => {
        if (students) {
            res.send({ message: "Student Department wise" })

            const Emails = students.map(function(student){return student.email;});

            console.log(Emails);


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
                        to: Emails, // list of receivers
                        subject: "Timetable Declare", // Subject line
                        text: "Pl check Timetable on website", // plain text body
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





    const timetable = new Timetable({
        department,
        year,
        trimester,
        program,
        type,
        date,
        ttfile
    })
    timetable.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Uploaded" })
            
        }
            
        

        

        
    })


})

app.get("/getdata", async(req, res) => {
    try {
        const timetabledata = await Timetable.find();
        res.status(201).json(timetabledata)
        console.log(timetabledata)
    } catch (error) {
        res.status(422).json(error);
    }
})



app.delete("/deletetimetable/:id", async(req, res) => {
    try {


        const { id } = req.params;

        const timetableinsividual = await Timetable.findByIdAndDelete({ _id: id });
        console.log(timetableinsividual);
        res.status(201).json(timetableinsividual)
    } catch (error) {
        res.status(422).json(error);
    }
})




const convoSchema = new mongoose.Schema({
    department: String,
    date: String,
    time: String,
    venue: String,
    invitation: String,

})

const Convo = new mongoose.model("Convo", convoSchema)

app.post("/convoadd", (req, res) => {
    const { department, date, time, venue, invitation } = req.body

    const convo = new Convo({
        department,
        date,
        time,
        venue,
        invitation

    })
    convo.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Uploaded" })

        }
    })

})

app.get("/getconvodata", async(req, res) => {
    try {
        const convodata = await Convo.find();
        res.status(201).json(convodata)
        console.log(convodata)
    } catch (error) {
        res.status(422).json(error);
    }
})

app.delete("/deleteconvo/:id", async(req, res) => {
    try {


        const { id } = req.params;

        const convosolo = await Convo.findByIdAndDelete({ _id: id });
        console.log(convosolo);
        res.status(201).json(convosolo)
    } catch (error) {
        res.status(422).json(error);
    }
})


const resultSchema = new mongoose.Schema({
    department: String,
    trimester: String,
    type: String,
    date: String,

})

const Result = new mongoose.model("Result", resultSchema)

app.post("/resultadd", (req, res) => {
    const { department, trimester, type, date } = req.body

    const result = new Result({
        department,
        trimester,
        type,
        date,

    })
    result.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Uploaded" })

        }
    })

})

app.get("/getresultdata", async(req, res) => {
    try {
        const resultdata = await Result.find();
        res.status(201).json(resultdata)
        //console.log(resultdata)
    } catch (error) {
        res.status(422).json(error);
    }
})

app.delete("/deleteresult/:id", async(req, res) => {
    try {


        const { id } = req.params;

        const resultsolo = await Result.findByIdAndDelete({ _id: id });
        //console.log(resultsolo);
        res.status(201).json(resultsolo)
    } catch (error) {
        res.status(422).json(error);
    }
})



const faqSchema = new mongoose.Schema({
    id: Number,
    title: String,
    link: String,

})

const Faq = new mongoose.model("Faq", faqSchema)

app.post("/faqadd", (req, res) => {
    const { id, title, link } = req.body

    const faq = new Faq({
        id,
        title,
        link,

    })
    faq.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Uploaded" })

        }
    })


})

app.get("/getfaqdata", async(req, res) => {
    try {
        const faqdata = await Faq.find();
        res.status(201).json(faqdata)
       // console.log(faqdata)
    } catch (error) {
        res.status(422).json(error);
    }
})



app.post("/updatefaq", async(req, res) => {


    const { _id, id, title, link } = req.body

    const newdata = new Faq({
        _id,
        id,
        title,
        link,

    })
    const faqdata = await Faq.findByIdAndUpdate(_id, { $set: req.body }, newdata);
    res.status(201).json(faqdata)
    //console.log(faqdata)

})


const DivSchema = new mongoose.Schema({
    prn: Number,
    email: String,
    mob: Number,
    requirement: [{
        value: Number,
        label: String
      }]
})

const Div = new mongoose.model("Div", DivSchema)

app.post("/Div", (req, res) => {
    const { prn, email, mob, requirement } = req.body

    const div = new Div({
        prn,
        email,
        mob,
        requirement
    })
    console.log(div);
    div.save(err => {
        if (err) {
            res.send(err)
        } else {
            res.send({ message: "Successfully Uploaded" })

        }
    })


})
app.use('/app', routesCerti)
app.use('/app', routesOffTr)
app.use('/app', routesConGC)
app.use('/app', routesTriToSem)
app.use('/app', routesOQ)
app.use('/app', routesEquC)
app.use('/app', routesDupGC)








app.listen({ hostname: "127.0.0.1", port: "4000" }, () => console.log("server is running on port 4000"))