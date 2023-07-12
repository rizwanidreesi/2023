const express = require("express");
const app = express();

const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const fileUpload = require('express-fileupload');

const errorMiddleware=require('./middlewares/error')


app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(fileUpload());


// importing all routes
const adminRouter = require('./routes/adminRoutes');


// app.use('/api/v1/admins', auth);
app.use('/api/v1/admins', adminRouter);


// error handling middleware
app.use(errorMiddleware);
module.exports = app;