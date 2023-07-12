const Student = require('../models/student');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register Admin - Post: /api/v1/admins/stregister
exports.registerStudent= catchAsyncErrors(async (req, res, next)=>{

    req.body.admin = req.admin.id;
    const { name, classLevels } = req.body;

    const student = await Student.create({
        name,
        classLevels
    });

    sendToken(student, 200,res)

});

// Get all students by SuperAdmin & admin - GET = /api/v1/students/all
exports.getAllStudents = catchAsyncErrors(async (req, res, next) => {
    const student = await Student.find();
    res.status(200).json({
        success: true,
        count: student.length,
        data: student
    });
});
