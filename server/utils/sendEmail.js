// nodemailer
const nodemailer = require('nodemailer');

const sendEmail = async options => {
    // 1) Create a transporter
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD
        }
    });

    const message = {
        from: ` ${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    await transporter.sendMail(message);

    // // 2) Define the email options
    // var mailOptions = {
    //     from: '"Fred Foo 👻" <
    //     ' + process.env.SMTP_EMAIL + '>',
    //     to: options.email,
    //     subject: options.subject,
    //     text: options.message
    // };

    // // 3) Actually send the email
    // await transporter.sendMail(mailOptions);

    // console.log('Email sent successfully');

    // return true;

    // // 4) Handle error
    // transporter.sendMail(mailOptions, function (err, info) {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         console.log('Email sent successfully');

    //         return true;


    //     }


    // );

}

module.exports = sendEmail;
