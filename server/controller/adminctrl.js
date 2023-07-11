const Admin = require('../models/admin');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register Admin - Post: /api/v1/admin/register
exports.registerAdmin= catchAsyncErrors(async (req, res, next)=>{
    const { name, email, password } = req.body;

    const admin = await Admin.create({
        name,
        email,
        password
    });

    sendToken(admin, 200,res)

});