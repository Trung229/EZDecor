var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');
const userController = require('../controllers/user');


/* GET users listing. */
router.post('/createAccount', async function (req, res, next) {
    const { email } = req.body;
    const check = await userController.checkEmail(email);
    const { payload: { message, status } } = check;
    if (status) {
        const { data: { newAccount: { numberAuth } } } = check;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'dtrtr2@gmail.com',
                pass: '22112015ak'
            }
        });

        transporter.use('compile', hbs(
            {
                viewEngine: {
                    extname: '.handlebars',
                    partialDir: path.resolve('../ec2Decord/views'),
                    defaultLayout: false
                },
                viewPath: path.resolve('../ec2Decord/views'),
                extname: '.handlebars',

            }
        ))

        var mailOptions = {
            from: 'dtrtr2@gmail.com',
            to: email,
            subject: 'Sending Email using Node.js',
            template: 'index',
            context: {
                name: email,
                numberAuth: numberAuth
            }
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
        res.json({ status: "email is sent" })
    } else {
        res.json(message);
    }
});

router.post('/register', async function (req, res) {
    const {name, email, password, dob, code, phone} = req.body;
    if (!name || !email || !password || !dob || !code || !phone) {
        res.json({
            status: false,
            message: "some fields is empty"
        }
        )
    } else {
        const check = await userController.register(name, email, password, dob, code, phone);
        res.json(check);
    }
})

module.exports = router;