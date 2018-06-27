var nodemailer = require("nodemailer");

var smtpConfig = {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'deepanjandeveloper@gmail.com',
        pass: 'twistdev90'
    }
};

var poolConfig = {
    pool: true,
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
        user: 'deepanjandeveloper@gmail.com',
        pass: 'twistdev90'
    }
};

var transporter = nodemailer.createTransport(smtpConfig,poolConfig);



// send mail with defined transport object
exports.prepareSendEmail = (mailBody, mailHeader, mailTo) => sendEmail(mailBody, mailHeader, mailTo);

function sendEmail(mailBody, mailHeader, mailTo) {
    // setup e-mail data with unicode symbols
    var mailOptions = {
        from: '"Airline Reservation System 👥" <a@a.com>', // sender address
        to: mailTo, //'deep8@umbc.edu', // list of receivers
        subject: mailHeader,//'ARS', // Subject line
        //text: mailBody,//'Hello world 🐴', // plaintext body
        html: mailBody,//'<b>Hello world 🐴</b>' // html body
    };

    var x = transporter.sendMail(mailOptions, function(error, info){
    if(error){
        return console.log(error);
    }
    console.log('Message sent: ' + info.response);
    });
}


