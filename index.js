const express = require('express')
const app = express()
const mongoose = require('mongoose')
const encrypt = require('mongoose-encryption')
const mg = require('mailgun-js');
const routesCerti = require('./routes/routescertificate')
const routesOffTr = require('./routes/routesofftr')


const dotenv = require('dotenv')
const cors = require('cors')
const md5 = require('md5');
const DateOnly = require('mongoose-dateonly')(mongoose);


app.use(express.json())
app.use(express.urlencoded())
app.use(cors())



dotenv.config()

const mailgun = () =>
    mg({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMIAN,
    });

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




app.get("/getstudent", async(req, res)=>{
    try {
        const studata = await Student.find();
        res.status(201).json(studata)
        console.log(studata)
    } catch (error) {
        res.status(422).json(error);
        console.log(error);
    }
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
    trimester: String,
    type: String,
    date: DateOnly,
    ttfile: String,

})

const Timetable = new mongoose.model("Timetable", timetableSchema)

app.post("/timetableadd", (req, res) => {
    const { department, trimester, type, date, ttfile } = req.body

    const timetable = new Timetable({
        department,
        trimester,
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
        console.log(resultdata)
    } catch (error) {
        res.status(422).json(error);
    }
})

app.delete("/deleteresult/:id", async(req, res) => {
    try {


        const { id } = req.params;

        const resultsolo = await Result.findByIdAndDelete({ _id: id });
        console.log(resultsolo);
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
        console.log(faqdata)
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
    console.log(faqdata)

})




app.post('/api/email', (req, res) => {
    const { email, subject, message } = req.body;
    mailgun()
        .messages()
        .send({
                from: 'abc <examdepartment@mitwpu.edu.in>',
                to: `${email}`,
                subject: `${subject}`,
                html: `<p>${message}</p>`,
            },
            (error, body) => {
                if (error) {
                    console.log(error);
                    res.status(500).send({ message: 'Error in sending email' });
                } else {
                    console.log(body);
                    res.send({ message: 'Email sent successfully' });
                }
            }
        );
});





app.use('/app', routesCerti)
app.use('/app', routesOffTr)




app.listen({ hostname: "127.0.0.1", port: "4000" }, () => console.log("server is running on port 4000"))