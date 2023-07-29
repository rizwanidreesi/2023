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
const classLevelRouter = require('./routes/classLevelRoutes');
const academicYearRouter = require('./routes/academicYearRoutes');
const academicTermRouter = require('./routes/academicTermRoutes');
// const programRouter = require('./routes/programRoutes');
const studentRouter = require('./routes/studentRoutes');
const teacherRouter = require('./routes/teacherRoutes');



// app.use('/api/v1/admins', auth);
app.use('/api/v1/admins', adminRouter);
app.use('/api/v1/academic-year', academicYearRouter);
app.use('/api/v1/academic-term', academicTermRouter);
app.use('/api/v1/classlevel', classLevelRouter);
// app.use('/api/v1/programs', programRouter);
app.use('/api/v1/students', studentRouter);
app.use('/api/v1/teachers', teacherRouter);





// error handling middleware
app.use(errorMiddleware);
module.exports = app;