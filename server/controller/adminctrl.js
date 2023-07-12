const Admin = require('../models/admin');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// Register Admin - Post: /api/v1/admins/register
exports.registerAdmin= catchAsyncErrors(async (req, res, next)=>{
    const { name, email, password } = req.body;

    const admin = await Admin.create({
        name,
        email,
        password
    });

    sendToken(admin, 200,res)

});

// login user - POST = /api/v1/admins/login
exports.loginAdmin = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new ErrorHandler('Please provide email and password', 400));
    }

    // find user in database
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin || !(await admin.correctPassword(password, admin.password))) {
        return next(new ErrorHandler('Incorrect email or password', 401));
    }

    sendToken(admin, 200, res);

});

// Get Currently logged in admin - GET = /api/v1/admins/me
exports.getAdminProfile = catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);
    // const admin = await req.Admin;
    res.status(200).json({
        success: true,
        data: admin
    })
});

// logout admin - POST = /api/v1/admins/logout
exports.logoutAdmin = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({
        success: true,
        message: 'logout successful'
    });
});

// Get all admin by SuperAdmin - GET = /api/v1/admin/all
exports.getAllAdmin = catchAsyncErrors(async (req, res, next) => {
    const admins = await Admin.find();
    res.status(200).json({
        success: true,
        count: admins.length,
        data: admins
    });
});

// Get admin details by id by SuperAdmin  => api/v1/admins/admin/:id
exports.getAdminDetails = catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findById(req.params.id);

    if (!admin) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        admin
    })
})

// update admin profile by superAdmin - PUT = /api/v1/admins/update/:id
exports.updateAdmin = catchAsyncErrors(async (req, res, next) => {

    const newAdminData = {
        name: req.body.name,
        email: req.body.email,
        // password: req.body.password,
        role: req.body.role
    }

    const admin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    if (!admin) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        admin
    })
});

  

// delete admin - DELETE = /api/v1/admins/admin/:id
exports.deleteAdmin = catchAsyncErrors(async (req, res, next) => {
    const admin = await Admin.findByIdAndDelete(req.params.id);

    if (!admin) {
        return next(new ErrorHandler(`User not found with id: ${req.params.id}`, 404));
    }

    // await Admin.remove();

    res.status(204).json({
        success: true,
        message: 'Admin deleted'
    })
})