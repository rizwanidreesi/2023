// import { createTransport } from "nodemailer";
const nodemailer = require("nodemailer")
 
const myEmail = async (email, subject, text) => {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transport.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject,
    text,
  });
};

module.exports = myEmail