const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');


app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());


// importing all routes


// app.use('/api/v1/admins', auth);



module.exports = app;